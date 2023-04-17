import { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";

export default function Common() {

  const [token, setToken] = useState(null);
  const [userRole, setuserRole] = useState(null);
  const [userBrand, setuserBrand] = useState(null);

  // const nodeurl = 'http://192.168.0.107:5000/';
  const nodeurl = 'https://backend-for-app-code.onrender.com/';
  // const nodeurl = 'https://shopsppl.net/';


  useEffect(() => {
    let token = window.localStorage.getItem("token");
    if (token) {
      setToken(token);
      const decoded = jwt_decode(window.localStorage.getItem("token"));
      setuserRole(decoded.role);
      setuserBrand(decoded.brand);
    }

  }, []);

  const tokenValue = window.localStorage.getItem("token") || token;
  const userRoleValue = userRole || 'main-admin';
  const userBrandValue = userBrand;

  return {
    nodeurl, tokenValue, userRoleValue, userBrandValue
  }
}

