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
Object.defineProperty(exports, '__esModule', { value: true })
exports.DeleteOneUser =
  exports.UpdateOnePassword =
  exports.UpdateOneEmail =
  exports.UpdateOneUsername =
  exports.GetOneUserData =
    void 0
const user_service_1 = require('../services/user.service')
const http_status_codes_1 = require('http-status-codes')
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
      return
    } catch (err) {
      console.log(err)
      next(err)
      console.log('Error while gettig user data')
    }
  })
exports.GetOneUserData = GetOneUserData
const UpdateOneUsername = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
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
      console.log('Error while deleting user')
    }
  })
exports.DeleteOneUser = DeleteOneUser
