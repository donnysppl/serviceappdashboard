import { useEffect, useState } from 'react'
import Loader from '../../../Loader';
import Common from '../../Common';
import DataTable, { createTheme } from 'react-data-table-component';
import { NavLink, useParams } from 'react-router-dom';
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import Swal from 'sweetalert2';

export default function EditUser() {

    const { id } = useParams();

    const [loader, setloader] = useState(true)
    const [addUserInput, setaddUserInput] = useState({
        name: '',
        email: '',
        password: '',
        usertype: '',
        brand: '',
        status:'',
    })

    const [showPass, setshowPass] = useState(false);

    useEffect(() => {

        allUserData();

    }, [])

    const { tokenValue, nodeurl, userRoleValue } = Common();

    const allUserData = async (e) => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `bearer ${tokenValue}` },
        };

        //   console.log(tokenValue)
        await fetch(nodeurl + `admins/list/${id}`, requestOptions).then((res) => res.json())
            .then((res) => {
                console.log(res);
                setloader(false);

                if (res.status === 200) {
                    setaddUserInput(res.result);
                    
                }

                else if (res.status === 400) {
                    alert("somthing went wrong")
                }

            }
            )
    }




    const handleInput = (e) => {
        e.persist();
        setaddUserInput({ ...addUserInput, [e.target.name]: e.target.value });
    }

    const addUserForm = async (e) => {
        e.preventDefault();
        // setloader(true);
        const data = {
            name: addUserInput.name,
            email: addUserInput.email,
            password: addUserInput.password,
            usertype: addUserInput.usertype,
            brand: addUserInput.brand,
            status:  addUserInput.status,
        }

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `bearer ${tokenValue}` },
            body: JSON.stringify(data),
        };

        await fetch(nodeurl + `admins/edit/${id}`, requestOptions).then((res) => res.json())
            .then((res) => {
                console.log(res);

                if (res.status === 200) {
                    Swal.fire(
                        'Saved',
                        `${res.message}`,
                        'success'
                    ).then(function(){
                        window.location.reload();
                    })
                }

                else if (res.status === 400) {
                    alert("somthing went wrong")
                }

            })

    }

    const columns = [
        {
            name: '#',
            selector: (row, index) => index + 1,
            cellExport: (row, index) => index + 1,
            width: '60px',
        },
        {
            name: 'name',
            selector: row => (row.name),
            cellExport: row => (row.name),
        },
        {
            name: 'email',
            selector: row => (row.email),
            cellExport: row => (row.email),
        },
        {
            name: 'User Role',
            selector: row => (row.usertype),
            cellExport: row => (row.usertype),
        },
        {
            name: 'User Brand',
            selector: row => (row.brand),
            cellExport: row => (row.brand),
        },
        {
            name: 'Action',
            cell: (row) => <>
                <div className="status complete me-2">
                    <span>Active</span>
                </div>
                <button onClick={() => console.log(row._id)} className='btn btn-primary py-1 px-2 table-btn'>
                    <NavLink to={`/admin/services/${row._id}`}>Edit</NavLink>
                </button>
            </>
        }
    ];

    createTheme('solarized', {
        text: {
            primary: '#ffffff',
            secondary: '#ffffff',
        },
        background: {
            default: 'rgba(0,0,0,0)',
            text: '#FFFFFF',
        },
        context: {
            background: '#cb4b16',
            text: '#FFFFFF',
        },
        divider: {
            default: '#073642',
        },
        action: {
            button: 'rgba(0,0,0,.54)',
            hover: 'rgba(0,0,0,.08)',
            disabled: 'rgba(0,0,0,.12)',
        },
    }, 'dark');

    const customStyles = {
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                background: '#000000',
            },
        },
        cells: {
            style: {
                padding: '10px 8px',
            },
        },

    };

    return (
        <>

            <div className="container mt-3">
                <div className="row">
                    <div className="col-lg-9 mx-auto">

                        <div className="wrapper-bg common-bg p-4 rounded-2 position-relative  mt-3">
                            {
                                loader ? <Loader /> : null
                            }
                            <h3 className='fw-semibold'>Edit Admin User</h3>

                            <form className='mt-4' onSubmit={addUserForm}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input required type="name" name="name" placeholder='name' className="form-control" id="name"
                                        onChange={handleInput} value={addUserInput.name} />
                                    {/* // onChange={(e) => setname(e.target.value)}/> */}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input required type="email" name="email" placeholder='email' className="form-control" id="email"
                                        onChange={handleInput} value={addUserInput.email} />
                                    {/* // onChange={(e) => setemail(e.target.value)}/> */}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="position-relative">
                                        <input required type={showPass ? "text" : "password"} name="password" placeholder='password' className="form-control" id="password"
                                            onChange={handleInput}  />
                                        <div className="password-icon" onClick={(e) => setshowPass(!showPass)}>
                                            {
                                                showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />
                                            }
                                        </div>
                                    </div>

                                    {/* onChange={(e) => setpassword(e.target.value)}/> */}

                                </div>
                                <div className="mb-4">
                                    <label htmlFor="usertype" className="form-label">User Type</label>
                                    <select className="form-select" name="usertype" required
                                        onChange={handleInput} value={addUserInput.usertype} >
                                        {/* // onChange={(e) => setusertype(e.target.value)}> */}

                                        <option >Choose Your User Type/Role</option>
                                        <option value="main-admin">Main Admin</option>
                                        <option value="services-admin">Services Admin</option>
                                        <option value="installation-admin">Installation Admin</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="brand" className="form-label">Brand Type</label>
                                    <select className="form-select" name="brand" required
                                        onChange={handleInput} value={addUserInput.brand} >
                                        {/* // onChange={(e) => setusertype(e.target.value)}> */}

                                        <option >Choose Your User Brand</option>
                                        {
                                            userRoleValue === 'main-admin' ?
                                                <option value="all">All</option> : null
                                        }
                                        <option value="thomson">Thomson</option>
                                        <option value="kodak">Kodak</option>
                                        <option value="blaupunkt">Blaupunkt</option>
                                        <option value="white westinghouse">White Westinghouse</option>
                                        <option value="westinghousetv">Westinghousetv</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="status" className="form-label">Admin User Status</label>
                                    <select className="form-select" name="status" required
                                        onChange={handleInput} value={addUserInput.status} >
                                        <option >Choose Your Admin User Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">In Active</option>
                                    </select>
                                </div>


                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>


                    </div>
                </div >
            </div >
        </>
    )
}
