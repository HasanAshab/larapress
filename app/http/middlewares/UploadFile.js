const multer = require('multer');

module.exports = (fieldName, fileCount = null) => {
  if(fileCount){
    return multer().array(fieldName, fieldName);
  }
  return multer().single(fieldName);
}