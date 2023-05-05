const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

class Storage {
  static mock(){
    this.isMocked = true;
  }
  static putFile(storage_path, file){
    const hash = this.hashFileName(file.originalname);
    const filePath = path.join(storage(storage_path), hash);
    if (!this.isMocked) {
      fs.writeFile(filePath, file.buffer, (err) => {
        if (err) throw err;
      });
    }
    return filePath;
  };

  static hashFileName(fileName){
    const hash = crypto
      .createHash("md5")
      .update(fileName)
      .digest("hex")
      .substring(0, 15);
    const fileExt = path.extname(fileName);
    const hashedFileName = `${Date.now()}_${hash}${fileExt}`;
    return hashedFileName;
  };
}

module.exports = Storage;
