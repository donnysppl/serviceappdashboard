import Logo from '../../assets/img/sppl_logo.png';
import { AiOutlineDashboard, AiOutlineUserAdd } from "react-icons/ai";
import { MdElectricalServices, MdPayment, MdOutlineLogout } from "react-icons/md";
import { RiInstallLine } from "react-icons/ri";
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Common from '../Common';
import { MdMiscellaneousServices } from "react-icons/md";

export default function Sidebar() {


  const { userRoleValue } = Common();

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/');
  }


  return (
    <>
      <div className="sidebar-inner-div text-white">

        <div className="logo-part d-flex align-items-center gap-3">
          <img src={Logo} alt="Logo" className="img-fluid w-50" />
          <span>Admin</span>
        </div>

        <hr />

        <div className="sidebar-link-list">
          <ul className="list-group">
            <li className="list-group-item">
              <NavLink to={"/admin/dashboard"}>
                <AiOutlineDashboard /> Dashboard
              </NavLink>
            </li>
            {userRoleValue === "services-admin" || userRoleValue === "main-admin" ?
              <li className="list-group-item"><NavLink to={"/admin/services"}><MdElectricalServices /> Service</NavLink></li>
              : null
            }
            {
              userRoleValue === "installation-admin" || userRoleValue === "main-admin" ?
                <li className="list-group-item"><NavLink to={"/admin/installation"}><RiInstallLine /> Installation</NavLink></li>
                : null
            }
            {
              userRoleValue === "main-admin" ?
                <li className="list-group-item"><NavLink to={"/admin/user"}><AiOutlineUserAdd /> User</NavLink></li>
                : null
            }
            {
              userRoleValue === "main-admin" ?
                <li className="list-group-item"><NavLink to={"/admin/user-record"}><AiOutlineUserAdd /> User Record</NavLink></li>
                : null
            }
            {
              userRoleValue === "main-admin" ?
                <li className="list-group-item"><NavLink to={"/admin/payment"}><MdPayment /> Payment</NavLink></li>
                : null
            }
            <li className="list-group-item"><NavLink to={"/admin/warranty"}><MdMiscellaneousServices /> Warranty</NavLink></li>
            <li  onClick={logout} className="list-group-item" ><a><span ><MdOutlineLogout /> Logout</span></a></li>
          </ul>

        </div>

      </div>
    </>
  )
}
