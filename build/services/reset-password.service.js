"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPassword = void 0;
const bcrypt_1 = require("bcrypt");
const db_configs_1 = require("../configs/db.configs");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
// service to reset password with reset link
const ResetPassword = (resetToken, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // verify that reset token exits and is not expired
        const foundResetToken = yield db_configs_1.db.query('SELECT email FROM reset_tokens WHERE reset_tokens.token = $1 AND reset_tokens.expiry_date > NOW()', [resetToken]);
        if (foundResetToken.rowCount <= 0) {
            return {
                success: false,
                message: 'Reset Token Invalid or Expired'
            };
        }
        // then verify if user exists for token realated email
        const foundUser = yield db_configs_1.db.query('SELECT userid,username,salt,email FROM users WHERE users.email = $1', [
            foundResetToken.rows[0].email
        ]);
        if (foundUser.rowCount <= 0) {
            return {
                success: false,
                message: 'No User Account Found'
            };
        }
        // old user password salt
        const originalSalt = foundUser.rows[0].salt;
        // hash new password with old salt
        const newHashedPassword = yield (0, bcrypt_1.hash)(newPassword, originalSalt);
        // update user db
        const updateUserPassword = yield db_configs_1.db.query('UPDATE users SET password = $1 WHERE users.email = $2 RETURNING userid,username,email', [newHashedPassword, foundUser.rows[0].email]);
        if (updateUserPassword.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to reset password'
            };
        }
        // remove reset token then
        const removeResetToken = yield db_configs_1.db.query('DELETE FROM reset_tokens WHERE reset_tokens.token = $1 AND reset_tokens.email = $2 RETURNING email', [resetToken, foundUser.rows[0].email]);
        if (removeResetToken.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to reset password'
            };
        }
        return {
            success: true,
            message: 'Successfully reset password'
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while resetting password');
        return {
            success: false,
            message: 'Failed to reset password'
        };
    }
});
exports.ResetPassword = ResetPassword;
