let fs = require('fs');

const deleteZip = (zipName) => {
    if (fs.existsSync(zipName)){
        fs.rmSync(zipName, { recursive: true });
    }
}

module.exports = deleteZip;