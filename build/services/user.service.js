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
exports.DeleteUser =
  exports.UpdatePassword =
  exports.UpdateEmail =
  exports.UpdateUsername =
  exports.GetUserData =
    void 0
const bcrypt_1 = require('bcrypt')
const db_configs_1 = require('../configs/db.configs')
const logger_utils_1 = __importDefault(require('../utils/logger.utils'))
// service for get  user's data
const GetUserData = authenticatedUserid =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // get the user data from db
      const userData = yield db_configs_1.db.query(
        'SELECT username,userid,email,role,last_logout,createat FROM users WHERE users.userid = $1',
        [authenticatedUserid]
      )
      if (userData.rowCount <= 0) {
        return {
          success: false,
          message: 'No user found'
        }
      }
      return {
        success: true,
        message: 'Get User Data successful',
        data: userData.rows[0]
      }
    } catch (err) {
      logger_utils_1.default.error(err, 'Error while getting user data')
      return {
        success: false,
        message: 'Error occured while getting user data'
      }
    }
  })
exports.GetUserData = GetUserData
// service for updating user's userame
const UpdateUsername = (authenticatedUserId, newUsername) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const updateStatus = yield db_configs_1.db.query(
        'UPDATE users SET username = $1 WHERE users.userid = $2 RETURNING userid,username,email',
        [newUsername, authenticatedUserId]
      )
      if (updateStatus.rowCount <= 0) {
        return {
          success: false,
          message: 'Error while updating username in query'
        }
      }
      return {
        success: true,
        message: 'Updated username Successfully',
        data: updateStatus.rows[0]
      }
    } catch (err) {
      logger_utils_1.default.error(err, 'Error while updating username')
      return {
        success: false,
        message: 'Error while updating username'
      }
    }
  })
exports.UpdateUsername = UpdateUsername
// service for updating user's email
const UpdateEmail = (authenticatedUserId, newEmail) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const updateStatus = yield db_configs_1.db.query(
        'UPDATE users SET email = $1 WHERE users.userid = $2 RETURNING userid,username,email',
        [newEmail, authenticatedUserId]
      )
      if (updateStatus.rowCount <= 0) {
        return {
          success: false,
          message: 'Error while updating email in query'
        }
      }
      return {
        success: true,
        message: 'Updated email Successfully',
        data: updateStatus.rows[0]
      }
    } catch (err) {
      logger_utils_1.default.error(err, 'Error while updating user email')
      return {
        success: false,
        message: 'Error while updating email'
      }
    }
  })
exports.UpdateEmail = UpdateEmail
// service for updating user's password
const UpdatePassword = (authenticatedUserId, oldPassword, newPassword) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // get original password hash from db
      const originalUserPassData = yield db_configs_1.db.query(
        'SELECT password,salt FROM users WHERE users.userid = $1',
        [authenticatedUserId]
      )
      if (originalUserPassData.rowCount <= 0) {
        return {
          success: false,
          message: 'Error while updating password'
        }
      }
      const originalPasswordHash = originalUserPassData.rows[0].password
      const originalSalt = originalUserPassData.rows[0].salt
      // first comparing old password
      const isVerified = yield (0, bcrypt_1.compare)(oldPassword, originalPasswordHash)
      if (!isVerified) {
        return {
          success: false,
          message: 'Old Password incorrect'
        }
      }
      // now prepare new password hash with old salt and new password
      const newHashedPassword = yield (0, bcrypt_1.hash)(newPassword, originalSalt)
      // update db user password
      const updateStatus = yield db_configs_1.db.query(
        'UPDATE users SET password = $1 WHERE users.userid = $2 RETURNING userid,username,email',
        [newHashedPassword, authenticatedUserId]
      )
      if (updateStatus.rowCount <= 0) {
        return {
          success: false,
          message: 'Error while updating password'
        }
      }
      return {
        success: true,
        message: 'Updated Password successfully',
        data: updateStatus.rows[0]
      }
    } catch (err) {
      logger_utils_1.default.error(err, 'Error whil updating user password')
      return {
        success: false,
        message: 'Error while updating password'
      }
    }
  })
exports.UpdatePassword = UpdatePassword
// service for deleting user
const DeleteUser = (authenticatedUserId, password) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // first get the user for db
      const originalUserPassData = yield db_configs_1.db.query(
        'SELECT userid,email,username,password FROM users WHERE users.userid = $1',
        [authenticatedUserId]
      )
      if (originalUserPassData.rowCount <= 0) {
        return {
          success: false,
          message: 'Error while deleting user'
        }
      }
      const originalPasswordHash = originalUserPassData.rows[0].password
      // then comparing the password
      const isVerified = yield (0, bcrypt_1.compare)(password, originalPasswordHash)
      if (!isVerified) {
        return {
          success: false,
          message: 'Password is invalid'
        }
      }
      // here delete user accoutn from db
      const deleteStatus = yield db_configs_1.db.query('DELETE FROM users WHERE users.userid = $1', [
        authenticatedUserId
      ])
      if (deleteStatus.rowCount <= 0) {
        return {
          success: false,
          message: 'Erorr while deleting user'
        }
      }
      return {
        success: true,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `Successfully deleted ${originalUserPassData.rows[0].username}'s account`,
        data: {
          userid: originalUserPassData.rows[0].userid,
          username: originalUserPassData.rows[0].username,
          email: originalUserPassData.rows[0].email
        }
      }
    } catch (err) {
      logger_utils_1.default.error(err, 'Error while deleting user')
      return {
        success: false,
        message: 'Error while deleting user'
      }
    }
  })
exports.DeleteUser = DeleteUser
