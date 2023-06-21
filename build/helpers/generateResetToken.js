'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const uuid_1 = require('uuid')
const logger_utils_1 = __importDefault(require('../utils/logger.utils'))
// function to generate random uuid
const generateResetToken = () => {
  try {
    // generate uuid token
    const resetToken = (0, uuid_1.v4)()
    return {
      success: true,
      message: 'Successfully generated reset token',
      token: resetToken
    }
  } catch (err) {
    logger_utils_1.default.error('Error while generting reset token', err)
    return {
      success: false,
      message: 'Error while genrating reset token'
    }
  }
}
exports.default = generateResetToken
