import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import Logo from '../assets/img/sppl_logo.png';
import Common from './Common';

export default function Login() {
  const { nodeurl, setToken, saveToken } = Common();

  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [loading, setloading] = useState(false);

  const navigate = useNavigate(); 

  const loginFormSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
    };

    

    await fetch(nodeurl + 'admins/login', requestOptions).then((res) => res.json())
      .then((res) => {
        console.log(res);

        if (res.data.status === 200) {
          console.log("Sucess ");
          setToken( res.data.token );
          // console.log(res.data.token)

          localStorage.setItem('token' , JSON.stringify({value : res.data.token }));
          navigate('/admin');
          setloading(false);
        }

        else if (res.status === 400) {
          alert("somthing went wrong")
        }

      })


  }
  

  return (
    <>
      <section className="login-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-12 mx-auto">
              <div className="login-part text-white position-relative">
              {
                loading ? <Loader/> : null
              }
                <div>
                  <img src={Logo} alt="logo" className="img-fluid mb-4" />

                </div>
                <h2>Welcome Back 👋</h2>
                <hr />
                <form onSubmit={loginFormSubmit}>
                  <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" name='email' className="form-control" id="email" placeholder='Email address'
                      onChange={(e) => setemail(e.target.value)} />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" name='password' className="form-control" id="password" placeholder='password'
                      onChange={(e) => setpassword(e.target.value)} />
                  </div>

                  <button type="submit" className="btn btn-primary">Submit</button>
                </form>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
