import DataTable, { createTheme } from 'react-data-table-component';
import { useEffect, useRef, useState } from 'react';

import { NavLink } from 'react-router-dom';
import Common from '../../Common';

import { CSVLink } from "react-csv";
import moment from 'moment';

export default function Index() {

  const { tokenValue, nodeurl, brand, todayDate, prevDate } = Common();

  const [search, setsearch] = useState('');
  const [servList, setservList] = useState();
  const [servListfilter, setservListfilter] = useState();
  const [loader, setloader] = useState(true);
  const [dataReverse, setdataReverse] = useState();
  const [dataFilter, setdataFilter] = useState([]);
  const [excelDataArray, setexcelDataArray] = useState([]);

  const i = useRef(true);
  useEffect(() => {
    if (i.current) {
      i.current = false;
      servData();

    }
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

    await fetch(nodeurl + `admins/warrantydata`, requestOptions).then((res) => res.json())
      .then((res) => {
        console.log(res);

        if (res.status === 200) {
          setservList(res.data && res.data.reverse());
          setloader(false);
          setdataReverse(res.data && res.data.reverse());
          setdataFilter(res.data && res.data.reverse());
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
        'Status': res[i].status,
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
      width: '60px',
    },
    {
      name: 'Customer Name',
      selector: row => (row.name),
      cellExport: row => (row.name),
      
    },
    {
      name: 'Brand',
      selector: row => (row.brand),
      cellExport: row => (row.brand),
      
    },
    {
      name: 'Customer Email',
      selector: row => (row.email),
      cellExport: row => (row.email),
      
    },
    {
      name: 'Customer Mobile no',
      selector: row => (row.mobile),
      cellExport: row => (row.mobile),
      
    },
    {
      name: 'Product Category',
      selector: row => (row.productType),
      cellExport: row => (row.productType),
      
    },
    {
        name: 'Product Model',
        selector: row => (row.productName),
        cellExport: row => (row.productName),
        
    },
    {
        name: 'Product Purchase Date',
        selector: row => (row.purchaseDate),
        cellExport: row => (row.purchaseDate),
        
    },
    {
        name: 'Product invoice',
        selector: row => <>
            <a className='btn btn-primary btn-sm' href={`${nodeurl + row.invoice[0].path}`}>Click Here</a>
        </>,
        cellExport: row => <>
            <a className='btn btn-primary btn-sm' href={`${nodeurl + row.invoice[0].path}`}>Click Here</a>
        </>,
        
    },
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
        whiteSpace: 'initial',
      },
    },

  };

  const filterHandle = (e) => {
    setloader(true);
    e.preventDefault();
    const filterbyday = document.getElementById('filterbyday').value;
    const filterbystatus = document.getElementById('filterbystatus').value;

    let data = [];
    data = dataReverse;
    const result = data.filter(data => {
      if (filterbystatus === 'all' && filterbyday === 'all') {
        return data;
      }
      else if (filterbystatus === 'all' && filterbyday !== 'all') {
        return moment(data.createdAt).format('YYYY-MM-DD') === filterbyday;
      }
      else if (filterbystatus !== 'all' && filterbyday === 'all') {
        return data.status === filterbystatus;
      }
      else if (filterbystatus !== 'all' && filterbyday !== 'all') {
        return data.status === filterbystatus && moment(data.createdAt).format('YYYY-MM-DD') === filterbyday;
      }
    }

    );
    setdataFilter(result);
    excelDataLoop(result);
    setloader(false);
  }

  return (
    <>
      <section>
        <div className="container mt-5">
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper-bg common-bg p-4 rounded-2 position-relative">
                <h3 className='fw-semibold'>Warranty Request</h3>
                <div className="table-part table-responsive warrenty">
                  <DataTable className='text-break ' theme="solarized" customStyles={customStyles}
                    data={dataFilter} progressPending={loader} 
                    columns={columns}
                    pagination highlightOnHover subHeader
                    subHeaderComponent={
                      <div className='w-100 list-heading-part pb-3'>
                        <div className='text-center'>
                          {
                            excelDataArray.length ?
                              <CSVLink data={excelDataArray} target="_blank" ><button className='btn btn-primary'>Export Excel</button></CSVLink> : <span>Loading / Click Filter <br/>to Export</span>
                          }
                        </div>
                        <div>
                          <label htmlFor="Search" className="form-label">Search</label>
                          <input type="text" placeholder='Search' className='form-control'
                            value={search} onChange={(e) => setsearch(e.target.value)} />
                        </div>

                        <form onSubmit={filterHandle} className='fliter-form'>
                          <div className="filter-date">
                            <label htmlFor="filterbyDay" className="form-label">Filter By Day</label>
                            <select className="form-select" name='filterbyday' id='filterbyday' defaultValue={'all'} >
                              <option value={todayDate}>Today</option>
                              <option value={prevDate}>Yesterday</option>
                              <option value="all">All</option>
                            </select>
                          </div>
                          {/* <div className="filter-status">
                            <label htmlFor="filterbyStatus" className="form-label">Filter By Status</label>
                            <select className="form-select" name='filterbystatus' id='filterbystatus' defaultValue={'all'} >
                              <option value="all">All</option>
                              <option value="initial">New</option>
                              <option value="pending">Pending</option>
                              <option value="complete">Complete</option>
                            </select>
                          </div> */}
                          <button className='btn btn-primary'>Filter</button>
                        </form>
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
