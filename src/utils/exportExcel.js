import FileSaver from 'file-saver'
import XLSX from 'xlsx'

// 导出Excel 需要传入文件名
const exportExcel = (id,name) => {
    /* generate workbook object from table */
    var wb = XLSX.utils.table_to_book(document.querySelector('#'+id))
    /* get binary string as output */
    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
    try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), name+'_caping_ccsp' + '.xlsx')
    } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
    return wbout
}

export {exportExcel}