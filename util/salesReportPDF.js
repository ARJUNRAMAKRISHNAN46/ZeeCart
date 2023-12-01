const ejs = require('ejs');
const pdf = require('html-pdf');
const fs = require('fs');
module.exports ={

  downloadPdf : (req,res,orders,startDate,endDate,totalSales)=>{
    const template = fs.readFileSync('util/salesReport.ejs', 'utf-8');
    const html = ejs.render(template, { orders, startDate, endDate, totalSales });
    
    const pdfOptions = {
        format: 'A3',
        orientation: 'portrait',
    };
    pdf.create(html, pdfOptions).toFile(`public/SRpdf/sales-report.pdf`, (err, response) => {
        if (err) return console.log(err);
        res.status(200).download(response.filename);
    });
    }
}