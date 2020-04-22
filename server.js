const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

const fromDir = (startPath) => {
    // console.log(startPath, filter);
    if (!fs.existsSync(startPath)) {
        console.log('no path')
        return
    }
    var files = fs.readdirSync(startPath);
    return files;
}

let textFiles = fromDir('./OCREngine-1TxtFiles');

let csvData = [];
let resultData = [];
fs.createReadStream('./OcrData/Extracted Entities.csv').pipe(csv())
    .on('data', (row) => {
        csvData.push(row);
    }).on('end', () => {
        console.log('asdf', csvData[0])
        let row = {};
        //get the files from OCRSpaceTxtFiles folder
        for (let i = 0; i < textFiles.length; i++) {
            //get object from csvdata
            for (let j = 0; j < csvData.length; j++) {
                //match invoice number
                if (parseInt(textFiles[i].match(/(\d+)/)) === parseInt(csvData[j].imagefileId)) {
                    let textData = fs.readFileSync(`./OCREngine-1TxtFiles/${textFiles[i]}`, { encoding: 'utf8', flag: 'r' });
                    //console.log(textData, 'one file done');
                    //row.push(i);
                    row.imagefileId = csvData[j].imagefileId;
                    for (let property in csvData[j]) {
                        if (property !== 'imagefileId') {
                            if (textData !== null && csvData[j][property] !== '' && textData.includes(csvData[j][property])) {
                                row[property] = 1;
                            } else if (csvData[j][property] === '') {
                                row[property] = '';
                            }
                            else {
                                row[property] = 0
                            }
                        }
                    }
                    resultData.push(row);
                    row = {};
                }
            }
        }
        const csvWriter = createCsvWriter({
            path: './result/OCREngine-1Result.csv',
            header: [
                { id: 'imagefileId', title: 'imagefileId' },
                { id: 'InvoiceDate', title: 'Invoice Date' },
                { id: 'InvoiceNumber', title: 'Invoice Number' },
                { id: 'VendorGSTIN', title: 'Vendor GSTIN' },
                { id: 'InvoiceTotal', title: 'Invoice Total' },
                { id: 'CGST', title: 'CGST' },
                { id: 'SGST', title: 'SGST' },
                { id: 'IGST', title: 'IGST' },
                { id: 'invoiceDueDate', title: 'invoice due date' }
            ]
        })
        csvWriter.writeRecords(resultData).then(() => {
            console.log('success')
        }).catch((err) => {
            console.log(err)
        })
    });



app.listen(port, () => {
    console.log('server is up on port 5000');
});


