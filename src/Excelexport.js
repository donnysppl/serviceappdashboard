import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';

export default function Excelexport({excelData, fileName}) {
    const fileType = '"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8';
    const fileExtension = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = { Sheet: {'data' : ws}, SheetName : ['date']};
        const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type : 'array'});
        const data = new Blob([excelBuffer],{type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
  return (
    <>
        <button onClick={(e) => exportToExcel()} className='btn btn-primary'>Export</button>
    </>
  )
}
