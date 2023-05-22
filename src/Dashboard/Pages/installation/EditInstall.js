import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Common from '../../Common';
import Swal from 'sweetalert2';
import { useRef } from 'react';
import Loader from '../../../Loader';

export default function Edit() {

  const { nodeurl, tokenValue, adminId } = Common();

  const { id } = useParams();

  const [servDetail, setservDetail] = useState();
  // const [warrType, setwarrType] = useState();

  const [addPayOpt, setaddPayOpt] = useState(false);
  const [formValues, setFormValues] = useState([{ name: "", price: "" }]);
  const [total, settotal] = useState(0);

  const [paymentTb, setpaymentTb] = useState(null);
  const [paymentStatus, setpaymentStatus] = useState(false);

  const [userid, setuserid] = useState();
  const [paymentId, setpaymentId] = useState();

  const [invoiceUrl, setinvoiceUrl] = useState();

  const [totalPayAmt, settotalPayAmt] = useState();

  const [paymentList, setpaymentList] = useState(null);

  const [loader, setloader] = useState(true);

  const i = useRef(true);
  useEffect(() => {
    if (i.current) {
      i.current = false;
      servData();
    }


  }, [])

  const servData = async () => {
    await fetch(nodeurl + 'admins/servicedetail/' + id, {
      method: 'GET',
    }).then((res) => res.json())
      .then((res) => {
        console.log(res);
        // console.log(res.result.payment_details)

        if (res.status === 200) {
          // console.log("Sucess");
          setservDetail(res.result);
          setpaymentTb(res.result && res.result.payment_details)
          setuserid(res.result.userId);

          setloader(false);
          if(res.result.invoice.length >= 1){
            setinvoiceUrl(res.result.invoice);
          }

          if (res.result.payment_details.length === 0) {
            setpaymentId(null);
          }
          else {
            setpaymentId(res.result.payment_details[0].payment_detailid);
            paymentDetail(res.result.payment_details[0].payment_detailid);
          }
        }

        else if (res.status === 400) {
          alert("somthing went wrong")
        }

      })
  }

  const addPayOptHandle = () => {
    if (paymentTb && paymentTb.length === 1) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Payment Detail already Exist. If you want to change the details than delete the previous data and then create the new payment',
      });
    }
    else {
      setaddPayOpt(!addPayOpt);
    }
  }

  const handleChange = (i, e) => {
    const newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
    // settotal(total + )
  }
  // console.log(formValues && formValues.price);
  const addFormFields = () => {
    setFormValues([...formValues, { name: "", price: "" }])
  }

  const removeFormFields = (i) => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const priceData = formValues.reduce((pre, curr) => {
      return parseInt(pre) + parseInt(curr.price)
    }, 0)
    settotal(priceData);
    console.log(priceData)

    const paymentDataSubmit = async () => {
      await fetch(nodeurl + 'admins/paymentupdate/' + id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `bearer ${tokenValue}` },
        body: JSON.stringify({
          formValues, userid
        }),
      }).then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            console.log('Success')
          }
          else if (res.status === 400) {
            console.log('Somthing went wrong')
          }

        })
    }

    Swal.fire({
      icon: 'warning',
      color: '#000',
      title: 'Do you want to sent the Payment Amount?',
      showCancelButton: true,
      confirmButtonText: 'Save',
      html: 'The Total Payable amount is ' + priceData,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        paymentDataSubmit();
        Swal.fire('Saved!', '', 'success');
        setInterval(windowReload, 3000);
      }
      else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })

  }

  const deletePayDetail = (e) => {
    e.preventDefault();

    console.log(nodeurl + `paymentdelete/${paymentId}`)

    if (window.confirm("Are you really want to delete the Payment")) {
      const thisClicked = e.currentTarget;
      thisClicked.innerText = "Deleting";

      fetch(nodeurl + `admins/paymentdelete/${paymentId}`, {
        method: 'POST',
      })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            alert("Success Deleted");
            thisClicked.closest("tr").remove();
            setInterval(windowReload, 3000);
          }
          else if (res.status === 404) {
            alert("Error");
            // window.location.reload();
            console.log(res)
          }
        })


    }
  }

  const paymentDetail = async (res) => {

    await fetch(nodeurl + `admins/paymentdetail/${res}`, {
      method: 'GET',
    }).then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          console.log('Success')
          setpaymentList(res && res.result);
          totalAmt(res.result.payments);

          if(res.result.status === "payment completed"){
            console.log(res.result.status === "payment completed")
            setpaymentStatus(true);
          }
          else{
            setpaymentStatus(false);
          }

        }
        else if (res.status === 400) {
          alert('Somthing went wrong')
        }

      })
  }

  const totalAmt = (res) => {
    let price = 0;
    let data = res;
    let datalength = data.length;

    for (let i = 0; i < datalength; i++) {
      price = price + parseInt(data[i].price);

    }
    settotalPayAmt(price);
    return price
  }

  function windowReload() {
    window.location.reload();
  }

  const handleInput = async (e) => {
    setloader(true);
    const data = {
      status: e.target.value,
      adminid: adminId,
    }
    await fetch(nodeurl + `admins/servicestatus/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: res.message,
            showConfirmButton: false,
            timer: 1000
          }).then(function () {
            window.location.reload();
          });
          setloader(false);

        }
        else {
          alert(res.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <>
      <section>
        <div className="container">
          <div className="col-lg-12">
            <div className="wrapper-bg common-bg p-4 rounded-2 position-relative mt-5">
              
              <div className="row align-items-center">
                <div className="col-lg-8 col-md-6">
                <h2>Installation Detail</h2>
                </div>
                <div className="col-lg-4 col-md-6">

                  <div className="">
                    <p>
                    Current Status : <span className={`text-capitalize servicedetail ${servDetail && servDetail.status} `}>{servDetail && servDetail.status}</span>
                    </p>
                    

                    <select className="form-select" name="status"
                      onChange={handleInput} value={servDetail && servDetail.status} >
                      <option value="initial" >Update Status Request</option>
                      <option value="pending">pending</option>
                      <option value="complete">Complete</option>
                    </select>
                  </div>
                </div>
              </div>
              <hr />

              {loader ? <Loader /> : null}

              <div className="service-data-part row">
                <div className="services-details-part pb-3 ps2"> <h5>Customer Person Details</h5>
                  <ul>
                    <li><span>Name :</span> {servDetail && servDetail.firstname} {servDetail && servDetail.lastname}</li>
                    <li><span>Email :</span>{servDetail && servDetail.email}</li>
                    <li><span>Mobile No :</span>{servDetail && servDetail.mobile}</li>
                    <li><span>Alternate Mobile No :</span>{servDetail && servDetail.altmobile}</li>
                    <li><span>Address :</span>{servDetail && servDetail.address}</li>
                    <li><span>City :</span>{servDetail && servDetail.city}</li>
                    <li><span>State :</span>{servDetail && servDetail.state}</li>
                    <li><span>Pincode :</span>{servDetail && servDetail.pincode}</li>
                  </ul>
                </div>
                <hr />
                <div className="services-details-part pb-3"> <h5>Product Details</h5>
                  <ul>
                    <li><span>Brand :</span> {servDetail && servDetail.brand}</li>
                    <li><span>Product Name :</span>{servDetail && servDetail.productname}</li>
                    <li><span>Complaint Type :</span>{servDetail && servDetail.complaint_type}</li>
                    <li><span>Warranty Type :</span>{servDetail && servDetail.warranty}</li>
                    <li><span>Purchase Date :</span>{servDetail && servDetail.purchase_date}</li>
                    <li><span>Set Serial No :</span>{servDetail && servDetail.set_serialno}</li>
                    <li><span>Purchase Date :</span>{servDetail && servDetail.purchase_date}</li>
                    <li><span>Query :</span>{servDetail && servDetail.query}</li>
                  </ul>

                  <hr />
                  <div className="invoice-part">
                    <h4 className='mb-3'>Product Invoice</h4>
                    <h6>Product Invoice : {invoiceUrl ? <a className='btn btn-primary btn-sm' href={`${nodeurl}${invoiceUrl}`} download>Click Here</a> : "Bill Not Found"} </h6>
                  </div>
                </div>
              </div>

              <hr />



              <div className="add-payment-btn-part text-end mt-4">
                <button className='btn btn-primary' onClick={addPayOptHandle}>
                  {addPayOpt ? "Remove Payment Part" : "Add Payment Part"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {
        addPayOpt && addPayOpt ?
          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="wrapper-bg common-bg p-4 rounded-2 position-relative mt-5">
                    <h3>
                      Add Payment Details
                    </h3>

                    <form className='mt-3' onSubmit={handleSubmit}>

                      {formValues.map((element, index) => (
                        <div className="form-inline" key={index}>
                          <div className="row mb-3">
                            <div className="col-4">
                              <label className='form-label'>Name</label>
                              <input type="text" name="name" className="form-control" value={element.name || ""} onChange={e => handleChange(index, e)} />

                            </div>
                            <div className="col-4">
                              <label className='form-label'>Price</label>
                              <input type="number" name="price" className="form-control" value={element.price || ""} onChange={e => handleChange(index, e)} />

                            </div>
                            {
                              index ?
                                <div className="col-3 d-flex align-items-center">
                                  <button type="button" className="btn btn-danger remove mt-3" onClick={() => removeFormFields(index)}>Remove</button>
                                </div>
                                : null
                            }
                          </div>

                        </div>
                      ))}

                      <div className="button-section">
                        {
                          formValues.length !== 6 ?
                            <button className="btn btn-primary add me-3" type="button" onClick={() => addFormFields()}>Add</button>
                            : null
                        }
                        <button className="btn btn-primary submit" type="submit">Submit</button>
                      </div>
                    </form>
                  </div>

                </div>
              </div>
            </div>
          </section>
          : null
      }


      {
        paymentList ?
          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="wrapper-bg common-bg p-4 rounded-2 position-relative mt-5 payment-list">
                    <h3 className='pt-3 pb-2'>Payment Data Exist</h3>
                    <table className="table text-white mt-2">
                      <thead className="table-dark">
                        <tr>
                          <td>User name</td>
                          <td>User email</td>
                          <th>Status</th>
                          <th>Total Amount</th>
                          {!paymentStatus ? <td>
                            <th>Opt</th>
                          </td> : null}
                        </tr>
                      </thead>
                      <tbody>
                        <tr >
                          <td>{paymentList.name}</td>
                          <td>{paymentList.email}</td>
                          <td>{paymentList.status}</td>
                          <td>{totalPayAmt && totalPayAmt}</td>
                          {!paymentStatus ? <td>
                            <button className='btn btn-primary ' onClick={(e) => deletePayDetail(e)} >Delete</button>
                          </td> : null}
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

          : null}


    </>
  )
}
