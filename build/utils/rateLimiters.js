"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resettPasswordAccountLimit = exports.forgotPasswordAccountLimit = exports.logoutAccountLimit = exports.loginAccountLimit = exports.createAccountLimit = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// create account rate limit
const createAccountLimit = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Too many account creations from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false
});
exports.createAccountLimit = createAccountLimit;
// login account rate limit
const loginAccountLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many account login from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false
});
exports.loginAccountLimit = loginAccountLimit;
// login account rate limit
const logoutAccountLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many account logout from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false
});
exports.logoutAccountLimit = logoutAccountLimit;
// forgot password rate limit
const forgotPasswordAccountLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'To many account forgot password requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false
});
exports.forgotPasswordAccountLimit = forgotPasswordAccountLimit;
// reset password rate limit
const resettPasswordAccountLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'To many account reset password requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false
});
exports.resettPasswordAccountLimit = resettPasswordAccountLimit;
