const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class Storage {
  static putFile = (storage_path, file) => {
    const hash = Storage.hashFileName(file.originalname);
    const filePath = path.join(storage(storage_path), hash);
    fs.writeFile(filePath, file.buffer, (err) => {
      if (err) throw err;
    });
    return filePath;
  }
  
  static hashFileName = (fileName) => {
    const hash = crypto.createHash('md5').update(fileName).digest('hex').substring(0, 15);
    const fileExt = path.extname(fileName);
    const hashedFileName = `${Date.now()}_${hash}${fileExt}`;
    return hashedFileName;
  };
  
}

module.exports = Storage;