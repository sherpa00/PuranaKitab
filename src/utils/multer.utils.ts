import multer from "multer";

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // eslint-disable-next-line n/no-path-concat
        cb(null, `${__dirname}/../../static`)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const multerStorage = multer({
    storage: diskStorage
})

export default multerStorage