'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.ForgotPasswordRouter = void 0
const express_1 = __importDefault(require('express'))
const express_validator_1 = require('express-validator')
const forgot_password_controller_1 = require('../controllers/forgot-password.controller')
const rateLimiters_1 = require('../utils/rateLimiters')
const router = express_1.default.Router()
exports.ForgotPasswordRouter = router
router.post(
  '/',
  (0, express_validator_1.body)('email')
    .notEmpty()
    .withMessage('Email Body should not be empty')
    .isEmail()
    .withMessage('Should use correct email'),
  // rate limiter
  rateLimiters_1.forgotPasswordAccountLimit,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  forgot_password_controller_1.ForgotPasswordOne
)
