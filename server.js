const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');


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

let textFiles = fromDir('./OCRSpaceTxtFiles');

let csvData = [];
let resultData = [];
fs.createReadStream('./OcrData/Extracted Entities.csv').pipe(csv())
    .on('data', (row) => {
        csvData.push(row);
    }).on('end', () => {
        //console.log('asdf', csvData[0])
        let row = [];
        //get the files from OCRSpaceTxtFiles folder
        for (let i = 0; i < textFiles.length; i++) {
            //get object from csvdata
            for (let j = 0; j < csvData.length; j++) {
                //match invoice number
                if (parseInt(textFiles[i].match(/(\d+)/)) === parseInt(csvData[j].imagefileId)) {
                    fs.readFile(`./OCRSpaceTxtFiles/${textFiles[i]}`, 'utf8', (err, txtData) => {
                        if (err) {
                            console.log(err);
                            return err;
                        }
                        for (let property in csvData[j]) {
                            //console.log(csvData[i][property]);
                            if (csvData[j][property] !== null && txtData.includes(csvData[j][property])) {
                                row.push(1);
                                //console.log('matched');
                            }
                            else {
                                row.push(0);
                                //console.log('not matched');
                            }
                        }
                        //console.log(row, 'asf')
                        pushData(row);
                        row = [];
                    })
                }
            }
        }
    });

const pushData = (data) => {
    resultData.push(data);
    console.log(resultData.length, 'asdfg');
}



app.listen(port, () => {
    console.log('server is up on port 5000');
});


