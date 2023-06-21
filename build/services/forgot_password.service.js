'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.ForgotPassword = void 0
const db_configs_1 = require('../configs/db.configs')
const generateResetToken_1 = __importDefault(require('../helpers/generateResetToken'))
const sendResetEmail_1 = __importDefault(require('../helpers/sendResetEmail'))
const logger_utils_1 = __importDefault(require('../utils/logger.utils'))
// service for forgot password
const ForgotPassword = email =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // first verify if user exists with email
      const foundUser = yield db_configs_1.db.query('SELECT * FROM users WHERE users.email = $1', [email])
      if (foundUser.rowCount <= 0) {
        return {
          success: false,
          message: 'No Account Found'
        }
      }
      // now generate token
      const tokenStatus = (0, generateResetToken_1.default)()
      if (!tokenStatus.success) {
        return {
          success: false,
          message: 'Failed with forgot password operation'
        }
      }
      const token = String(tokenStatus.token)
      const expireDate = new Date()
      expireDate.setHours(expireDate.getHours() + 1) // 1 hr expiry
      // add new token to db with expiry of 1hr to verify later
      const addTokenToDb = yield db_configs_1.db.query(
        'INSERT INTO reset_tokens(email, token, expiry_date) VALUES ($1, $2, $3) RETURNING *',
        [email, token, expireDate]
      )
      if (addTokenToDb.rowCount <= 0) {
        return {
          success: false,
          message: 'Failed with forgot password operation'
        }
      }
      // send email with token
      const sendEmailStatus = yield (0, sendResetEmail_1.default)(email, token)
      if (!sendEmailStatus.success) {
        return {
          success: false,
          message: 'Failed with forgot password operation'
        }
      }
      return {
        success: true,
        message: 'Successfully completed forgot password operation! Check your email'
      }
    } catch (err) {
      logger_utils_1.default.error(err, 'Error in forgot password operation')
      return {
        success: false,
        message: 'Error in forgot password operation'
      }
    }
  })
exports.ForgotPassword = ForgotPassword
