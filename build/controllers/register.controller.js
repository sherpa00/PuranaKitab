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
const http_status_codes_1 = require("http-status-codes");
const express_validator_1 = require("express-validator");
const register_service_1 = __importDefault(require("../services/register.service"));
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const registerOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // input validation
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        const requestBody = req.body;
        // trigger user service register
        const registerStatus = yield (0, register_service_1.default)(requestBody);
        if (!registerStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, registerStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: 'Successfully Registered New User'
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = registerOne;
