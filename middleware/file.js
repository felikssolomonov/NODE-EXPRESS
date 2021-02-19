const multer = require("multer");

const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

const getUniqueName = (file) => {
  return Date.now() + "_" + file.originalname;
};

const myStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "images");
  },
  filename(req, file, callback) {
    callback(null, getUniqueName(file));
  },
});

const myFileFilter = (req, file, callback) => {
  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

module.exports = multer({
  storage: myStorage,
  fileFilter: myFileFilter,
});
