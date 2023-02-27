import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";

export default function Common() {

  const navigate = useNavigate();
  const [token ,setToken] = useState();

  // const nodeurl = 'http://192.168.0.167:5000/';
  const nodeurl = 'https://backend-for-app-code.onrender.com/';

  const saveToken = (token) => {
    const expireTime = new Date().setDate(new Date().getDate() + 30);

    // creating session storage when user login
    localStorage.setItem('token', JSON.stringify({
      value : token,
    }));

    setToken(token);

    // navigate after user login to dashboard
    navigate('/admin');
  }

  // const servDash = (res) => {
  //   const data = res;

  //   console.log(data)
  // }

  

  if(localStorage.getItem("token")){
    const tokenData = JSON.parse(localStorage.getItem("token"));
    var tokenValue = tokenData.value;
  }
  const decoded = jwt_decode(tokenValue);
  const userRoleValue = decoded.role;
  // const userRoleValue = "services-admin";

  return {
    nodeurl, tokenValue , setToken : saveToken, userRoleValue
  }
}

