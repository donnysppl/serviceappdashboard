import { useEffect, useState } from 'react'
import Loader from '../../../Loader';
import Common from '../../Common';

export default function AllUser() {
    const [loader, setloader] = useState(false)

    const [allUser, setallUser] = useState();


    useEffect(() => {

      allUserData();
                
    }, [])

    const { tokenValue, nodeurl } = Common();

    const allUserData = async (e) => {
        setloader(true);

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `bearer ${tokenValue}` },
        };

        //   console.log(tokenValue)
        await fetch(nodeurl + 'admins/list', requestOptions).then((res) => res.json())
            .then((res) => {
                console.log(res);

                if (res.status === 200) {

                    setallUser(res.result);

                    setloader(false);

                }

                else if (res.status === 400) {
                    alert("somthing went wrong")
                }

            }
            )
    }


    const deleteUser = (e, id) => {
        e.preventDefault();
        console.log(id);

        if (window.confirm("Are you really want to delete the User")) {
            const thisClicked = e.currentTarget;
            thisClicked.innerText = "Deleting";

            fetch(nodeurl + `admins/delete/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `bearer ${tokenValue}` },
            })
                .then((res) => {
                    console.log(res);
                    if (res.status === 200) {
                        alert("Success Deleted");
                        thisClicked.closest("tr").remove();
                        window.location.reload();
                    }
                    else if (res.status === 404) {
                        alert("Error");
                        window.location.reload();
                        console.log(res)
                    }
                })


        }

    }


    const [addUserInput, setaddUserInput] = useState({
        name: '',
        email: '',
        password: '',
        usertype: '',
    })

    const handleInput = (e) => {
        e.persist();
        setaddUserInput({ ...addUserInput, [e.target.name]: e.target.value });
    }

    const addUserForm = async (e) => {
        e.preventDefault();
        setloader(true);
        console.log(addUserInput)

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `bearer ${tokenValue}` },
            body: JSON.stringify(addUserInput),
        };

        await fetch(nodeurl + 'admins/add', requestOptions).then((res) => res.json())
            .then((res) => {
                console.log(res);
                setloader(false)

                if (res.data.status === 200) {
                    alert("Sucess")
                }

                else if (res.status === 400) {
                    alert("somthing went wrong")
                }

            })

    }

    return (
        <>


            <div className="container mt-3">
                <div className="row">
                    <div className="col-lg-9 mx-auto">

                        <div className="wrapper-bg common-bg p-4 rounded-2 position-relative">

                            <h3 className='fw-semibold mb-3'>All User List</h3>

                            {loader ? <Loader /> : null}

                            <div className="table-responsive">
                                <table className="table text-white">
                                    <thead className='table-dark'>
                                        <tr>
                                            <th >#</th>
                                            <th >Name</th>
                                            <th >Email</th>
                                            <th >User Role</th>
                                            <th >Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allUser && allUser.map((item, index) => {
                                                return (
                                                    <tr id={item._id} key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{item.name}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.usertype}</td>
                                                        <td>
                                                            <button onClick={(e) => deleteUser(e, item._id)} className="btn btn-danger">Delete</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }

                                    </tbody>
                                </table>
                            </div>

                        </div>


                        <div className="wrapper-bg common-bg p-4 rounded-2 position-relative  mt-3">
                            {
                                loader ? <Loader /> : null
                            }
                            <h3 className='fw-semibold'>Create Dashboard User</h3>

                            <form className='mt-2' onSubmit={addUserForm}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="name" name="name" placeholder='name' className="form-control" id="name"
                                        onChange={handleInput} value={addUserInput.name} />
                                    {/* // onChange={(e) => setname(e.target.value)}/> */}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input type="email" name="email" placeholder='email' className="form-control" id="email"
                                        onChange={handleInput} value={addUserInput.email} />
                                    {/* // onChange={(e) => setemail(e.target.value)}/> */}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" name="password" placeholder='password' className="form-control" id="password"
                                        onChange={handleInput} value={addUserInput.password} />
                                    {/* onChange={(e) => setpassword(e.target.value)}/> */}

                                </div>
                                <div className="mb-4">
                                    <label htmlFor="usertype" className="form-label">User Type</label>
                                    <select className="form-select" name="usertype"
                                        onChange={handleInput} value={addUserInput.usertype} >
                                        {/* // onChange={(e) => setusertype(e.target.value)}> */}

                                        <option >Choose Your User Type/Role</option>
                                        <option value="main-admin">Main Admin</option>
                                        <option value="services-admin">Services Admin</option>
                                        <option value="installation-admin">Installation Admin</option>
                                    </select>
                                </div>

                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>


                    </div>
                </div>
            </div>
        </>
    )
}
