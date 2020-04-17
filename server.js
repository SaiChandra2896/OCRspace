const express = require('express');
const bodyParser = require('body-parser');
const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;


// readXlsxFile('./OcrData/Extracted Entities.xlsx').then((rows) => {
//     data = [...rows];
//     console.log(data);
// });

const fromDir = (startPath) => {
    // console.log(startPath, filter);
    if (!fs.existsSync(startPath)) {
        console.log('no path')
        return
    }
    var files = fs.readdirSync(startPath);
    return files;
}

const readData = async () => {
    let textFileData = [];
    let data = await readXlsxFile('./OcrData/Extracted Entities.xlsx');
    // console.log(typeof data[1][0]);
    let textFiles = fromDir('./OCRSpaceTxtFiles');
    //console.log(textFiles);
    for (let i = 1; i < data.length; i++) {
        for (let j = 0; j < textFiles.length; j++) {
            if (data[i][0] === parseInt(textFiles[j].match(/(\d+)/))) {
                let stream = fs.createReadStream(`./OCRSpaceTxtFiles/${textFiles[j]}`);
                textFileData.push(stream)
            }
        }

    }
    console.log(typeof textFileData[0]);
}

readData();

app.listen(port, () => {
    console.log('server is up on port 5000');
});


