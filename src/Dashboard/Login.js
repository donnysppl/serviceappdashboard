import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import Logo from '../assets/img/sppl_logo.png';
import Common from './Common';
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import Swal from 'sweetalert2';

export default function Login() {
  const { nodeurl } = Common();

  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [loading, setloading] = useState(false);
  const [showPass, setshowPass] = useState(false);

  const navigate = useNavigate();

  const loginFormSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
    };

    // console.log({ email: email, password: password })

    await fetch(nodeurl + 'admins/login', requestOptions).then((res) => res.json())
      .then((res) => {
        // console.log(res);

        if (res.status === 200) {
          // console.log("Sucess ");
          localStorage.setItem('token', res.token);
          navigate('/admin');
          setloading(false);
        }

        else if (res.status === 400) {

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: res.message,
          }).then(function () {
            window.location.reload();
          })
        }

      })


  }


  return (
    <>
      <section className="login-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-12 mx-auto d-flex align-items-center justify-content-center h-100vh">
              <div className="login-part text-white position-relative">
                {
                  loading ? <Loader /> : null
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
                    <div className="position-relative">
                      <input type={showPass ? "text" : "password"} name='password' className="form-control" id="password" placeholder='password'
                        onChange={(e) => setpassword(e.target.value)} />
                      <div className="password-icon" onClick={(e) => setshowPass(!showPass)}>
                        {
                          showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />
                        }
                      </div>

                    </div>
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
