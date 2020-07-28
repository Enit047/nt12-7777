const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images')
    },
    filename(req, file, cb) {
        const unqueName = BigInt(Math.floor(Math.random() * 1e40))
        cb(null, unqueName + '--' + file.fieldname + '.' + file.mimetype.slice(6))
    }   
})
const arrAllow = ['image/png', 'image/jpg', 'image/jpeg']
const fileFilter = (req, file, cb) => {
    if(arrAllow.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({
    storage,
    fileFilter
})