'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const multer_1 = __importDefault(require('multer'))
const diskStorage = multer_1.default.diskStorage({
  destination: (req, file, cb) => {
    // eslint-disable-next-line n/no-path-concat
    cb(null, `${__dirname}/../../static`)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const multerStorage = (0, multer_1.default)({
  storage: diskStorage
})
exports.default = multerStorage
