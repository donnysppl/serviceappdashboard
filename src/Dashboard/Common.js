import { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import moment from 'moment';

export default function Common() {

  const [token, setToken] = useState(null);
  const [userRole, setuserRole] = useState(null);
  const [userBrand, setuserBrand] = useState(null);
  const [userId, setuserId] = useState(null);

  // const nodeurl = 'http://192.168.0.113:5000/';
  // const nodeurl = 'https://backend-for-app-code.onrender.com/';
  const nodeurl = 'https://shopsppl.net/';


  useEffect(() => {
    let token = window.localStorage.getItem("token");
    if (token) {
      setToken(token);
      const decoded = jwt_decode(window.localStorage.getItem("token"));
      setuserRole(decoded.role);
      setuserBrand(decoded.brand);
      setuserId(decoded.id);
      localStorage.setItem('brand', decoded.brand);
    }

  }, []);

  const tokenValue = window.localStorage.getItem("token") || token;
  const userRoleValue = userRole || 'main-admin';
  const brand = localStorage.getItem('brand');
  const adminId = userId && userId;

  const today = new Date();
  const yesterday = moment(today).subtract(1, 'day').toDate();

  const todayDate = moment(today).format('YYYY-MM-DD');
  const prevDate = moment(yesterday).format('YYYY-MM-DD');

  return {
    nodeurl, tokenValue, userRoleValue, brand, adminId ,todayDate,prevDate
  }
}

