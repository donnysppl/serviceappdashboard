import DataTable, { createTheme } from 'react-data-table-component';
import { useEffect, useState } from 'react';

import Common from '../../Common';

export default function Index() {

  const { tokenValue, nodeurl } = Common();

  const [search, setsearch] = useState('');

  const [loader, setloader] = useState(true);
  const [dataReverse, setdataReverse] = useState();
  const [dataFilter, setdataFilter] = useState([]);



  // const i = useRef(true);
  useEffect(() => {
    // if(i.current){
    //     i.current = false;

    servData();


    // }
  }, [])

  useEffect(() => {
    const result = dataReverse && dataReverse.filter(dataRevers => {
      return dataRevers.name.toLowerCase().match(search.toLowerCase());
    });

    setdataFilter(result);
  }, [search])

  const servData = async (e) => {
    setloader(true);

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `bearer ${tokenValue}` },
    }

    await fetch(nodeurl + 'admins/paymentlist', requestOptions).then((res) => res.json())
      .then((res) => {
        // console.log(res.result);

        if (res.status === 200) {
          setloader(false);
          setdataReverse(res.result && res.result.reverse());
          setdataFilter(res.result && res.result.reverse());

        }

        else if (res.status === 400) {
          alert("somthing went wrong")
        }
      }
      )
  }


  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      cellExport: (row, index) => index + 1,
    },
    {
      name: 'Status',
      selector: row => (row.status),
      cellExport: row => (row.status),
      width: 200,
    },
    {
      name: 'Customer Name',
      selector: row => (row.name),
      cellExport: row => (row.name),
      width: 200,
    },
    {
      name: 'Customer Email',
      selector: row => (row.email),
      cellExport: row => (row.email),
      width: 200,
    },
    {
      name: 'Payment Amount',
      selector: row => totalAmt(row.payments),
      cellExport: row => totalAmt(row.payments),
      width: 200,
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
      },
    },

  };

  const totalAmt = (res) => {
    
    let price = 0;
    let data = res;
    let datalength = data.length;
    
    for(let i = 0; i < datalength; i++){
      price = price + parseInt(data[i].price);
      
    }

    return price
  }

  return (
    <>
      <section>
        <div className="container mt-5">
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper-bg common-bg p-4 rounded-2 position-relative">

                <h3 className='fw-semibold'>App Payment Data</h3>
                <div className="table-part table-responsive">
                  <DataTable theme="solarized" customStyles={customStyles}
                    data={dataFilter} progressPending={loader}
                    columns={columns}
                    pagination highlightOnHover subHeader
                    subHeaderComponent={
                      <div className='w-100 list-heading-part pb-3'>
                        
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
