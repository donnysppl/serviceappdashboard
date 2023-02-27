import DataTable, { createTheme } from 'react-data-table-component';
import { useEffect, useRef, useState } from 'react';

import { NavLink } from 'react-router-dom';
import Common from '../../Common';

import { CSVLink } from "react-csv";

export default function Index() {

  const { tokenValue, nodeurl } = Common();

  const [search, setsearch] = useState('');
  const [servList, setservList] = useState();
  const [loader, setloader] = useState(true);
  const [dataReverse, setdataReverse] = useState();
  const [dataFilter, setdataFilter] = useState([]);
  const [excelDataArray, setexcelDataArray] = useState([]);



  // const i = useRef(true);
  useEffect(() => {
    // if(i.current){
    //     i.current = false;

    servData();


    // }
  }, [])

  useEffect(() => {
    const result = dataReverse && dataReverse.filter(dataRevers => {
      return dataRevers.firstname.toLowerCase().match(search.toLowerCase());
    });

    setdataFilter(result);
  }, [search])

  const servData = async (e) => {
    setloader(true);

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `bearer ${tokenValue}` },
    }

    await fetch(nodeurl + 'admins/installation', requestOptions).then((res) => res.json())
      .then((res) => {
        console.log(res);

        if (res.status === 200) {
          setservList(res.result && res.result.reverse());
          setloader(false);
          setdataReverse(res.result && res.result.reverse());
          setdataFilter(res.result && res.result.reverse());
          excelDataLoop(res.result);

        }

        else if (res.status === 400) {
          alert("somthing went wrong")
        }
      }
      )
  }

  const excelDataLoop = (res) => {

    let excelData = [];

    const data = res && res;
    const datalength = data.length;

    for (let i = 0; i < datalength; i++) {
      excelData[i] = {
        'Complaint Type': res[i].complaint_type,
        'Name': res[i].firstname + " " + res[i].lastname,
        'Mobile': res[i].mobile,
        'Email': res[i].email,
        'Address': res[i].address,
        'City': res[i].city,
        'State': res[i].state,
        'Pincode': res[i].pincode,
        'Brand': res[i].brand,
        'Product Name': res[i].productname,
        'Purchase Date': res[i].purchase_date,
        'Serial No': res[i].set_serialno,
        'Warranty Type': res[i].warranty,
        'Query': res[i].query,

      }

    }
    setexcelDataArray(excelData);

  }

  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      cellExport: (row, index) => index + 1,
    },
    {
      name: 'Complaint Type',
      selector: row => (row.complaint_type),
      cellExport: row => (row.complaint_type),
      width: 200,
    },
    {
      name: 'Brand',
      selector: row => (row.brand),
      cellExport: row => (row.brand),
      width: 200,
    },
    {
      name: 'Product Name',
      selector: row => (row.productname),
      cellExport: row => (row.productname),
      width: 200,
    },
    {
      name: 'Customer Name',
      selector: row => (row.firstname + " " + row.lastname),
      cellExport: row => (row.firstname + " " + row.lastname),
      width: 200,
    },
    {
      name: 'Customer Email',
      selector: row => (row.email),
      cellExport: row => (row.email),
      width: 200,
    },
    {
      name: 'Action',
      cell: (row) => <button onClick={() => console.log(row._id)} className='btn btn-primary py-1 px-2 table-btn'>
        <NavLink to={`/admin/services/${row._id}`}>Edit</NavLink>
      </button>
    }
  ];


  createTheme('solarized', {
    text: {
      primary: '#ffffff',
      secondary: '#ffffff',
    },
    background: {
      default: 'rgba(0,0,0,0)',
      text: '#FFFFFF',
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    divider: {
      default: '#073642',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    },
  }, 'dark');

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
        background: '#000000',
      },
    },
    cells: {
      style: {
        padding: '10px 8px',
      },
    },

  };

  return (
    <>
      <section>
        <div className="container mt-5">
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper-bg common-bg p-4 rounded-2 position-relative">

                <h3 className='fw-semibold'>Installation Request</h3>
                <div className="table-part table-responsive">
                  <DataTable theme="solarized" customStyles={customStyles}
                    data={dataFilter} progressPending={loader}
                    columns={columns}
                    pagination highlightOnHover subHeader
                    subHeaderComponent={
                      <div className='w-100 list-heading-part pb-3'>
                        <div>
                          {
                            // console.log(excelDataArray)
                            excelDataArray.length ?
                              <CSVLink data={excelDataArray} target="_blank" ><button className='btn btn-primary'>Export Excel</button></CSVLink> : 'Loading'
                          }
                        </div>
                        <div>
                          <input type="text" placeholder='Search' className='form-control'
                            value={search} onChange={(e) => setsearch(e.target.value)} />
                        </div>


                      </div>
                    } />

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
