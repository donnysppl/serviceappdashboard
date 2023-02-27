import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom'
import Sidebar from './Component/Sidebar'
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";
import Logo from '../assets/img/sppl_logo.png';

export default function MasterLayout() {

  const [sidebar, setsidebar] = useState(false);

  const width = window.innerWidth;
  const breakpoint = 990;

  useEffect(() => {

    if (width < breakpoint) {
      setsidebar(true);
    }
    else {
      setsidebar(false);
    }

  }, [])



  return (
    <>
      <section className='master-layout'>
        <div id="sidebar-part" className={sidebar ? "sidebar-part show common-bg border-0" : "sidebar-part common-bg border-0"}
          >

          <Sidebar />

        </div>
        <div className={sidebar? "main-part show text-white" : "main-part text-white"} >

          <nav className={sidebar ? "navbar navbar-expand-lg bg-body-tertiary sticky-top common-bg text-white" : "navbar navbar-expand-lg bg-body-tertiary common-bg text-white"}>
            <div className="container-fluid">
         
                <div onClick={() => setsidebar(!sidebar)} className="menu-btn-part">
                  <button className='btn menu-btn '>
                    {
                      sidebar ? <HiOutlineMenuAlt4 /> : <RxCross1 />
                    }

                  </button>
                </div>

                {
                  sidebar ? <div className=" ps-3 logo-part d-flex align-items-center justify-content-end gap-3">
                    <img src={Logo} alt="Logo" className="img-fluid w-25" />
                    <span>Admin</span>
                  </div> : null
                }
           


            </div>
          </nav>

          <Outlet />

        </div>
      </section>
    </>
  )
}
