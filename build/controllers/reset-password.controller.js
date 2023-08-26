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
exports.ResetPasswordOne = void 0;
const express_validator_1 = require("express-validator");
const http_status_codes_1 = require("http-status-codes");
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const reset_password_service_1 = require("../services/reset-password.service");
// contorller for resetting password
const ResetPasswordOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation error
        const ValidationError = (0, express_validator_1.validationResult)(req);
        if (!ValidationError.isEmpty()) {
            const error = new custom_error_1.default('Invalidation Error', 403);
            throw error;
        }
        // req params for reset token
        const resetToken = req.params.token;
        // req body for new password
        const newPassword = req.body.password;
        // call reset password service
        const resetPasswordStatus = yield (0, reset_password_service_1.ResetPassword)(resetToken, newPassword);
        if (!resetPasswordStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, resetPasswordStatus));
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, resetPasswordStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.ResetPasswordOne = ResetPasswordOne;
