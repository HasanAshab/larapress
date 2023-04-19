const multer = require('multer');

const mimetypes = {
  image: ['image/jpeg', 'image/png', 'image/gif'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  video: ['video/mp4', 'video/mpeg', 'video/quicktime'],
  document: ['application/pdf', 'application/msword', 'application/vnd.ms-excel'],
  archive: ['application/zip', 'application/x-tar', 'application/gzip'],
  font: ['application/font-woff', 'application/font-sfnt', 'application/font-otf'],
  json: ['application/json'],
  xml: ['application/xml', 'text/xml'],
  text: ['text/plain', 'text/html'],
  csv: ['text/csv'],
  javascript: ['text/javascript', 'application/javascript'],
  css: ['text/css']
};

module.exports = (fieldName, type = '*', fileCount = null) => {
  const fileFilter = function (req, file, cb) {
    if (type === '*' || mimetypes[type].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError(`Only ${type} files are allowed!`));
    }
  }
  const upload = multer({fileFilter})

  if (fileCount) {
    return upload.array(fieldName, Number(fileCount));
  }
  return upload.single(fieldName);
}