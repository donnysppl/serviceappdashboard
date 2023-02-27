import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Common from '../../Common';
import Swal from 'sweetalert2';

export default function Edit() {

  const { nodeurl, tokenValue } = Common();

  const { id } = useParams();

  const [servDetail, setservDetail] = useState();
  const [warrType, setwarrType] = useState();

  const [addPayOpt, setaddPayOpt] = useState(false);
  const [formValues, setFormValues] = useState([{ name: "", price: "" }]);
  const [total, settotal] = useState(0);

  const [paymentTb, setpaymentTb] = useState(null);
  const [payCon, setpayCon] = useState(false);

  const [userid, setuserid] = useState();
  const [paymentId, setpaymentId] = useState();

  useEffect(() => {
    servData();
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
          setwarrType(res.result.warranty);
          setpaymentTb(res.result && res.result.payment_details)
          setuserid(res.result.userId)
          if(!res.result.payment_details){
            setpaymentId(null);
          }
          else{
            setpaymentId(res.result.payment_details[0].payment_detailid)
          }
        }

        else if (res.status === 400) {
          alert("somthing went wrong")
        }

      })
  }

  const invoiceUrl = servDetail && servDetail.invoice[0].path;
  const issueImg = servDetail && servDetail.issue_image;

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
      await fetch(nodeurl + 'admins/paymentdetail/' + id, {
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
          if (res.status === 400) {
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
        window.location.reload();
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

      fetch(nodeurl + `paymentdelete/${paymentId}`, {
        method: 'DELETE',
      })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            alert("Success Deleted");
            thisClicked.closest("tr").remove();
          }
          else if (res.status === 404) {
            alert("Error");
            // window.location.reload();
            console.log(res)
          }
        })


    }
  }





  return (
    <>
      <section>
        <div className="container">
          <div className="col-lg-12">
            <div className="wrapper-bg common-bg p-4 rounded-2 position-relative mt-5">
              <h2>Service Detail</h2>
              <hr />

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
                    <h4 className='mb-3'>Product Invoice and Error Images</h4>
                    <h6>Product Invoice : <a className='btn btn-primary btn-sm' href={`${nodeurl}${invoiceUrl}`} download>Click Here</a></h6>

                    {
                      warrType === 'Extended Warranty' ?
                        <h6>Extended Warranty Invoice : <a className='btn btn-primary btn-sm' href={`${nodeurl}${servDetail && servDetail.under_warranty[0].path}`} download>Click Here</a></h6>
                        : null
                    }
                    <h6>Issue Images : </h6>
                    <ul className='issue-img'>
                      {
                        issueImg && issueImg.map((item, index) => {
                          return (
                            <li key={index}><img src={`${nodeurl}${item.path}`} alt="issue img" className='img-fluid' /></li>
                          )
                        })
                      }
                    </ul>

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
                          formValues.length != 6 ?
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

      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper-bg common-bg p-4 rounded-2 position-relative mt-5 payment-list">
                <h3 className='pt-3 pb-2'>Payment Data Exist</h3>
                <table className="table text-white mt-2">
                  <thead className="table-dark">
                    <tr>
                      <th>Payment Data</th>
                      <th>Opt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      paymentTb && paymentTb.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.payment_detailid}</td>
                            <td>
                              <button className='btn btn-primary ' onClick={(e) => deletePayDetail(e)} >Delete</button>
                            </td>
                          </tr>
                        )
                      })
                    }

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
