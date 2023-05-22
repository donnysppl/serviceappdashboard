import { useEffect, useState } from "react";
import Common from "../../Common";
import DataTable, { createTheme } from 'react-data-table-component';
import { CSVLink } from "react-csv";

export default function UserRecord() {

    const { nodeurl, tokenValue } = Common();
    const [userList, setuserList] = useState();
    const [perUserRecord, setperUserRecord] = useState();
    const [loader, setloader] = useState(false);
    const [excelDataArray, setexcelDataArray] = useState();

    useEffect(() => {

        const userListData = async () => {
            await fetch(nodeurl + 'admins/list', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `bearer ${tokenValue}` },
            }).then(res => res.json())
                .then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        setuserList(res.result);
                    }
                    else {
                        alert(res.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
        userListData();
    }, []);

    const getUserRecordhandle = async (e) => {
        e.preventDefault();
        const userlistInp = document.getElementById('userlist').value;
        console.log(userlistInp);

        await fetch(nodeurl + `admins/adminservicerecord/${userlistInp}`, {
            method: 'GET',
        }).then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    setperUserRecord(res.data);
                    excelDataLoop(res.data);
                }
                else {
                    alert(res.message);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    const columns = [
        {
            name: '#',
            selector: (row, index) => index + 1,
            cellExport: (row, index) => index + 1,
            width: '60px',
        },
        {
            name: 'Complaint Type',
            selector: row => (row.complaint_type),
            cellExport: row => (row.complaint_type),

        },
        {
            name: 'Brand',
            selector: row => (row.brand),
            cellExport: row => (row.brand),

        },
        {
            name: 'Product Name',
            selector: row => (row.productname),
            cellExport: row => (row.productname),

        },
        {
            name: 'Customer Name',
            selector: row => (row.firstname + " " + row.lastname),
            cellExport: row => (row.firstname + " " + row.lastname),

        },
        {
            name: 'Customer Email',
            selector: row => (row.email),
            cellExport: row => (row.email),

        },
        {
            name: 'Status',
            selector: row => <>
                <div className="text-center">
                    <div className={`status me-2 ${row.status}`}>
                        <span>{row.status === 'initial' ? 'New' : row.status}</span>
                    </div>
                </div>
            </>,
            cellExport: row => (row.status),

        },
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
    const excelDataLoop = (res) => {

        let excelData = [];

        const data = res && res;
        const datalength = data.length;

        for (let i = 0; i < datalength; i++) {
            excelData[i] = {
                'Complaint Type': res[i].complaint_type,
                'Name': res[i].firstname + " " + res[i].lastname,
                'Mobile': res[i].mobile,
                'Email': res[i].email,
                'Address': res[i].address,
                'City': res[i].city,
                'State': res[i].state,
                'Pincode': res[i].pincode,
                'Brand': res[i].brand,
                'Product Name': res[i].productname,
                'Purchase Date': res[i].purchase_date,
                'Serial No': res[i].set_serialno,
                'Status': res[i].status,
                'Warranty Type': res[i].warranty,
                'Query': res[i].query,
            }
        }
        setexcelDataArray(excelData);

    }


    return (
        <>
            <section>
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="wrapper-bg common-bg p-4 rounded-2 position-relative">
                                <h3 className='fw-semibold'>User Record</h3>

                                <div className="user-reacord-input-part pb-4">
                                    <form className="d-flex align-items-end" onSubmit={getUserRecordhandle}>
                                        <div className="me-3 mt-2 w-25">
                                            <label htmlFor="userlist" className="form-label">Select User to get the Record</label>
                                            <select className="form-select" name='userlist' id='userlist' defaultValue={'all'} >
                                                <option value="all">Select User</option>
                                                {
                                                    userList && userList.map((item, index) => {
                                                        return (
                                                            <option key={index} id={item._id} value={item._id}>{item.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="btn-part">
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                        </div>
                                    </form>
                                </div>



                                {
                                    perUserRecord ?
                                        <>

                                            <hr />
                                            <div className="table-part table-responsive p-5">
                                                <DataTable theme="solarized" customStyles={customStyles}
                                                    data={perUserRecord && perUserRecord} progressPending={loader}
                                                    columns={columns}
                                                    pagination highlightOnHover subHeader
                                                    subHeaderComponent={
                                                        <>
                                                            <div className='w-100 list-heading-part pb-3'>
                                                                <div className='text-center'>
                                                                    {
                                                                        excelDataArray && excelDataArray.length ?
                                                                            <CSVLink data={excelDataArray} target="_blank" ><button className='btn btn-primary'>Export Excel</button></CSVLink> : <span>Loading / Click Filter <br />to Export</span>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </>
                                                    }
                                                />

                                            </div>
                                        </>


                                        : null
                                }







                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
