const multer = require('multer');

const mimetypes = {
  image: ['image/jpeg', 'image/png', 'image/gif'],
}

module.exports = (fieldName, type = null, fileCount = null) => {
  const fileFilter = function (req, file, cb) {
    if (mimetypes[type].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Only ${type} files are allowed!`));
    }
  }
  const upload = type
    ? multer({fileFilter})
    : multer();
  
  if (fileCount) {
    return upload.array(fieldName, fileCount);
  }
  return upload.single(fieldName);
}