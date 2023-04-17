// bootstrap
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

import { Navigate, Route, Routes } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import Login from './Dashboard/Login';

import Error from './Error';

import { useNavigate } from 'react-router-dom';

import './App.css';
import { useEffect, useState } from 'react';
import MasterLayout from './Dashboard/MasterLayout';
import Dashboard from './Dashboard/Pages/dashboard';
import Services from './Dashboard/Pages/services';
import Installation from './Dashboard/Pages/installation';
import EditServ from './Dashboard/Pages/services/EditServ';
import EditInstall from './Dashboard/Pages/installation/EditInstall';
import AllUser from './Dashboard/Pages/user/AllUser';
import Common from './Dashboard/Common';
import Payment from './Dashboard/Pages/payment';

function App() {
  const navigate = useNavigate();
  const [mainAdmin, setmainAdmin] = useState(false);
  const [servicesAdmin, setservicesAdmin] = useState(false);
  const [installationAdmin, setinstallationAdmin] = useState(false);


  const { tokenValue , userRoleValue } = Common();

  useEffect(() => {
    // tokenExpFnc();

  }, [])


  const tokenExpFnc = () => {
    if (tokenValue) {
      const decoded = jwt_decode(tokenValue, { header: true });
      const startTokenTime = decoded.iat;
      const endTokenTime = decoded.exp;
      if (startTokenTime > endTokenTime) {
        localStorage.clear();
        navigate('/');
      }

      userRole();
    }
    else {
      console.log('Token Not Exist');
      navigate('/');
    }

  }

  const userRole = () => {
    const decoded = jwt_decode(tokenValue);
    // const userRoleValue = decoded.role;
    // const userRoleValue = "main-admin";
    // console.log(userRoleValue === "main-admin")

    if (userRoleValue === "main-admin") {
      setmainAdmin(true);
    }
    else if (userRoleValue === "services-admin") {
      setservicesAdmin(true)
    }
    else if (userRoleValue === "installation-admin") {
      setinstallationAdmin(true)
    }
  }

  function MainUser({children}){
    if(userRoleValue === "main-admin"){
      return <>{children}</>;

    }else{
      return <Error/>;
    }
  }
  function ServiceUser({children}){
    if(userRoleValue === "services-admin" || userRoleValue === "main-admin"){
      return <>{children}</>;

    }else{
      return <Error/>;
    }
  }

  function InstallUser({children}){
    if(userRoleValue === "installation-admin" || userRoleValue === "main-admin"){
      return <>{children}</>;

    }else{
      return <Error/>;
    }
  }
  


  
  return (
    <>

      <Routes>
        <Route path='/' exact element={<Login />} />
        <Route path='/admin' exact element={<MasterLayout />} >

          <Route path='/admin/dashboard' exact element={<MainUser><Dashboard /></MainUser>} />
          <Route path='/admin/services' exact element={<ServiceUser><Services /></ServiceUser>} />
          <Route path='/admin/services/:id' exact element={<ServiceUser><EditServ /></ServiceUser>} />
          <Route path='/admin/installation' exact element={<InstallUser><Installation /></InstallUser>} />
          <Route path='/admin/installation/:id' exact element={<InstallUser><EditInstall /></InstallUser>} />
          <Route path='/admin/user' exact element={<MainUser><AllUser /></MainUser>} />
          <Route path='/admin/payment' exact element={<MainUser><Payment /></MainUser>} />
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" />}
          />

        </Route>

        <Route path='*' exact element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
