const cloudinary = require('cloudinary')
const cloudinaryStorage = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'ImagesGA',
  allowedFormats: ['jpg', 'png', 'pdf', 'PDF', 'docx', 'doc', 'xls', 'xlsx'],
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(pdf|doc|docx|jpg)$/)) {
      return cb(new Error('Error en el tipo de archivo.'))
    }
    cb(null, file.originalname)
  },
})

const uploadCloud = multer({ storage })

module.exports = uploadCloud
