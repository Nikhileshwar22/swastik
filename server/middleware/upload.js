const multer = require('multer')
const path = require('path')

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ALLOWED_FLOOR_PLAN_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

const storage = multer.memoryStorage()

const imageFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only JPG, PNG, and WEBP are allowed.`), false)
  }
}

const anyFileFilter = (req, file, cb) => {
  if (ALLOWED_FLOOR_PLAN_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}.`), false)
  }
}

const uploadImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: 10 },
})

const uploadMixed = multer({
  storage,
  fileFilter: anyFileFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: 10 },
})

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, error: 'File too large. Maximum size is 10MB.' })
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ success: false, error: 'Too many files uploaded.' })
    }
    return res.status(400).json({ success: false, error: err.message })
  }
  if (err) {
    return res.status(400).json({ success: false, error: err.message })
  }
  next()
}

module.exports = { uploadImages, uploadMixed, handleUploadError }
