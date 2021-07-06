let fs = require('fs');
let path = require('path');

const removeFiles = (root) => {
    fs.readdirSync(root, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlinkSync(path.join(root, file), err => {
                if (err) throw err;
            });
        }
    });
}

module.exports = removeFiles;