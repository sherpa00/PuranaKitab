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
exports.DeleteOneUser =
  exports.UpdateOnePassword =
  exports.UpdateOneEmail =
  exports.UpdateOneUsername =
  exports.GetOneUserData =
    void 0
const http_status_codes_1 = require('http-status-codes')
const user_service_1 = require('../services/user.service')
const express_validator_1 = require('express-validator')
const custom_error_1 = __importDefault(require('../utils/custom-error'))
// controller for get the user data
const GetOneUserData = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // get the authenticated userid
      const authenticatedUserData = req.user
      const authenticatedUserId = authenticatedUserData.userid
      const getUserDataStatus = yield (0, user_service_1.GetUserData)(authenticatedUserId)
      if (!getUserDataStatus.success) {
        res.status(http_status_codes_1.StatusCodes.BAD_GATEWAY).json(Object.assign({}, getUserDataStatus))
        return
      }
      res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, getUserDataStatus))
    } catch (err) {
      next(err)
    }
  })
exports.GetOneUserData = GetOneUserData
const UpdateOneUsername = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // validation error
      const validatonErrors = (0, express_validator_1.validationResult)(req)
      if (!validatonErrors.isEmpty()) {
        const error = new custom_error_1.default('Validation Error', 403)
        throw error
      }
      // get the authenticated userid
      const authenticatedUserData = req.user
      const authenticatedUserId = authenticatedUserData.userid
      const updateUsernameStatus = yield (0, user_service_1.UpdateUsername)(authenticatedUserId, req.body.newusername)
      if (!updateUsernameStatus.success) {
        res.status(http_status_codes_1.StatusCodes.BAD_GATEWAY).json(Object.assign({}, updateUsernameStatus))
        return
      }
      res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, updateUsernameStatus))
    } catch (err) {
      next(err)
    }
  })
exports.UpdateOneUsername = UpdateOneUsername
const UpdateOneEmail = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // validation error
      const validatonErrors = (0, express_validator_1.validationResult)(req)
      if (!validatonErrors.isEmpty()) {
        const error = new custom_error_1.default('Validation Error', 403)
        throw error
      }
      // get the authenticated userid
      const authenticatedUserData = req.user
      const authenticatedUserId = authenticatedUserData.userid
      const updateEmailStatus = yield (0, user_service_1.UpdateEmail)(authenticatedUserId, req.body.newemail)
      if (!updateEmailStatus.success) {
        res.status(http_status_codes_1.StatusCodes.BAD_GATEWAY).json(Object.assign({}, updateEmailStatus))
        return
      }
      res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, updateEmailStatus))
    } catch (err) {
      next(err)
    }
  })
exports.UpdateOneEmail = UpdateOneEmail
const UpdateOnePassword = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // validation error
      const validatonErrors = (0, express_validator_1.validationResult)(req)
      if (!validatonErrors.isEmpty()) {
        const error = new custom_error_1.default('Validation Error', 403)
        throw error
      }
      // get the authenticated userid
      const authenticatedUserData = req.user
      const authenticatedUserId = authenticatedUserData.userid
      const updatePasswordStatus = yield (0, user_service_1.UpdatePassword)(
        authenticatedUserId,
        req.body.oldpassword,
        req.body.newpassword
      )
      if (!updatePasswordStatus.success) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, updatePasswordStatus))
        return
      }
      res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, updatePasswordStatus))
    } catch (err) {
      next(err)
    }
  })
exports.UpdateOnePassword = UpdateOnePassword
const DeleteOneUser = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // validation error
      const validatonErrors = (0, express_validator_1.validationResult)(req)
      if (!validatonErrors.isEmpty()) {
        const error = new custom_error_1.default('Validation Error', 403)
        throw error
      }
      // get the authenticated userid
      const authenticatedUserData = req.user
      const authenticatedUserId = authenticatedUserData.userid
      const deleteStatus = yield (0, user_service_1.DeleteUser)(authenticatedUserId, req.body.password)
      if (!deleteStatus.success) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, deleteStatus))
        return
      }
      res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, deleteStatus))
    } catch (err) {
      next(err)
    }
  })
exports.DeleteOneUser = DeleteOneUser
