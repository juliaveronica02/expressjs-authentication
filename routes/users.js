var express = require('express');
var router = express.Router();
const UserController = require("../controllers/user")
const multer = require("multer")

// setting up a middleware specifying the destination for storing the images.
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
      // folder public - images - create folder banner130.
    cb(null, "./public/images/banner130/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  // image type.
  if (file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
      cb(null, true);
  } else {
      cb(null, false);
  }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/register", upload.single("image"), UserController.createUser, (req, res, next) => {
  try {
    // sharp configure.
    sharp(req.file.path).resize(250, 130).toFile('banner130/' + 'thumbnails-' + req.file.originalname, (err, resizeImage) => {
      if (err) {
          console.log(err);
      } else {
          console.log(resizeImage);
      }
  })
  return res.status(201).json({
      message: 'File uploded successfully'
  });
} catch (error) {
  console.error(error);
}
})
router.post("/login", UserController.login)
router.get("/show", UserController.getAllData)

module.exports = router;
