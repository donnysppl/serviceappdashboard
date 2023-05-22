import { useEffect, useState } from 'react';
import Common from '../../Common';
import DataTable, { createTheme } from 'react-data-table-component';
import { NavLink } from 'react-router-dom';

import { BiUser } from "react-icons/bi";
import { MdElectricalServices } from "react-icons/md";
import { RiInstallLine } from "react-icons/ri";
import Loader from "../../../Loader"

export default function Index() {

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

    </section>
  )
}
