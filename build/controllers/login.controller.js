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
const login_service_1 = __importDefault(require('../services/login.service'))
const http_status_codes_1 = require('http-status-codes')
const express_validator_1 = require('express-validator')
const custom_error_1 = __importDefault(require('../utils/custom-error'))
const LoginOne = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // input validation errors
      const errors = (0, express_validator_1.validationResult)(req)
      if (!errors.isEmpty()) {
        const error = new custom_error_1.default('Validation Error', 403)
        throw error
      }
      const requestBody = req.body
      // triggre login service
      const loginStatus = yield (0, login_service_1.default)(requestBody)
      if (!loginStatus.success) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Email or Password Incorrect'
        })
        return
      }
      res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, loginStatus))
    } catch (err) {
      next(err)
    }
  })
exports.default = LoginOne
