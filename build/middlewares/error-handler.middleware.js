"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorFailSafeHandler = exports.errorResponder = exports.errorLogger = void 0;
const http_status_codes_1 = require("http-status-codes");
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const errorLogger = (err, req, res, next) => {
    try {
        console.error('\x1b[31m', err); // adding colors to error
        next(err);
    }
    catch (err) {
        console.log(err);
        console.log('Error while logging errors');
    }
};
exports.errorLogger = errorLogger;
const errorResponder = (err, req, res, next) => {
    try {
        const statusCode = err instanceof custom_error_1.default ? err.statusCode : 500;
        res.status(statusCode);
        res.json({
            success: false,
            error: {
                message: err.message
            }
        });
    }
    catch (err) {
        console.log(err);
        console.log('Error while responding to errors');
    }
};
exports.errorResponder = errorResponder;
const errorFailSafeHandler = (err, req, res, next) => {
    try {
        // checking if response is already sent
        if (res.headersSent) {
            next(err);
        }
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: {
                message: 'Internal Server Error'
            }
        });
    }
    catch (err) {
        console.log(err);
        console.log('Error while fail safe handling errors');
    }
};
exports.errorFailSafeHandler = errorFailSafeHandler;
