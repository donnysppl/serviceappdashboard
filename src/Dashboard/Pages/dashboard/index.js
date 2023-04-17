import { useEffect, useState } from 'react';
import Common from '../../Common';
import DataTable, { createTheme } from 'react-data-table-component';
import { NavLink } from 'react-router-dom';

import { BiUser } from "react-icons/bi";
import { MdElectricalServices } from "react-icons/md";
import { RiInstallLine } from "react-icons/ri";
import Loader from "../../../Loader"

export default function Index() {

  const [newSerReqData, setnewSerReqData] = useState();
  const [loader, setloader] = useState(true);

  const [totalUser, settotalUser] = useState();
  const [totalService, settotalService] = useState();
  const [totalInstall, settotalInstall] = useState();

  const { nodeurl, tokenValue } = Common();


  useEffect(() => {

    newServReq();

  }, [])


  // new service request function start
  const newServReq = async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `bearer ${tokenValue}` },
    }

    await fetch(nodeurl + 'admins/dashboarddata', requestOptions).then((res) => res.json())
      .then((res) => {
        // console.log(res.result.totalServiceData);

        if (res.status === 200) {
          dataFilter(res.result.totalServiceData);
          settotalUser(res.result.totalAppUserLenght);
          settotalService(res.result.totalServiceDataLenght);
          settotalInstall(res.result.totalInstallDataLenght);
          setloader(false);
        }

        else if (res.status === 400) {
          alert("somthing went wrong")
        }
      }
      )
  }

  const newServReqColumns = [
    {
      name: 'Complaint Type',
      selector: row => row.complaint_type,
      width: 200,
    },
    {
      name: 'Brand',
      selector: row => row.brand,
      width: 200,
    },
    {
      name: 'Product Name',
      selector: row => row.productname,
      width: 200,
    },
    {
      name: 'Customer Name',
      selector: row => row.firstname + " " + row.lastname,
      width: 200,
    },
    {
      name: 'Customer Email',
      selector: row => row.email,
      width: 200,
    },
    {
      name: 'Action',
      cell: (row) => <NavLink to={`/admin/services/${row._id}`}>
        <button onClick={() => console.log(row._id)} className='btn btn-primary table-btn'>
          Edit
        </button></NavLink>
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
      default: 'rgba(255,255,255,0.25)',
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
        padding: '10px 10px',
        background: '#000000',
      },
    },
    cells: {
      style: {
        padding: '10px 10px',
      },
    },

  };

  const dataFilter = (res) => {
    const data = res;
    const dataRev = data.reverse();
    const dataSlice = dataRev.slice(0, 5);
    setnewSerReqData(dataSlice);
    setloader(false)

  }

  // new service request function End

  return (
    <section className='mt-3'>
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-4">
            <div className="wrapper-bg common-bg rounded-2 p-4 position-relative overflow-hidden total-no-div" >
            {loader ? <Loader/> : null}
              <div className=''>
                
                <h5 className='mb-4'>Total App Users</h5>
                <h2 className="mb-0">{totalUser && totalUser}</h2>
                <BiUser />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="wrapper-bg common-bg rounded-2 p-4 position-relative overflow-hidden total-no-div" >
            {loader ? <Loader/> : null}
              <div className=''>
                <h5 className='mb-4'>Total Services Request</h5>
                <h2 className="mb-0">{totalService && totalService}</h2>
                <MdElectricalServices />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="wrapper-bg common-bg rounded-2 p-4 position-relative overflow-hidden total-no-div" >
            {loader ? <Loader/> : null}
              <div className=''>
                <h5 className='mb-4'>Total Installation Request</h5>
                <h2 className="mb-0">{totalInstall && totalInstall}</h2>
                <RiInstallLine />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-3">
        <div className="row">
          <div className="col-lg-8">
            <div className="wrapper-bg common-bg rounded-2 position-relative">
              <div>
                <h4 className="py-3 px-3 mt-2">New Service Request</h4>

                <DataTable columns={newServReqColumns} data={newSerReqData}
                  theme="solarized" customStyles={customStyles} progressPending={loader}
                />
              </div>
              <hr />
              <div className="btn-part text-end pb-3 px-3">
                <NavLink className="btn btn-primary" to={'/admin/services'}>View All</NavLink>
              </div>


            </div>
          </div>

          {/* <div className="col-lg-4">
            <div className="wrapper-bg common-bg rounded-2 p-4 position-relative">
              <div>

              </div>


            </div>
          </div> */}

        </div>
      </div>


    </section>
  )
}
