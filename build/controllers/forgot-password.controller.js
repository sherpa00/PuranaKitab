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
exports.ForgotPasswordOne = void 0
const http_status_codes_1 = require('http-status-codes')
const express_validator_1 = require('express-validator')
const forgot_password_service_1 = require('../services/forgot_password.service')
const custom_error_1 = __importDefault(require('../utils/custom-error'))
// controller for forgot password operation
const ForgotPasswordOne = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // validation error
      const ValidationError = (0, express_validator_1.validationResult)(req)
      if (!ValidationError.isEmpty()) {
        const error = new custom_error_1.default('Validation Error', 403)
        throw error
      }
      // request body
      const { email } = req.body
      // call forgot password service
      const forgotPasswordStatus = yield (0, forgot_password_service_1.ForgotPassword)(email)
      if (!forgotPasswordStatus.success) {
        res.status(http_status_codes_1.StatusCodes.BAD_GATEWAY).json(Object.assign({}, forgotPasswordStatus))
        return
      }
      res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, forgotPasswordStatus))
    } catch (err) {
      next(err)
    }
  })
exports.ForgotPasswordOne = ForgotPasswordOne
