"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const rateLimiters_1 = require("../../utils/rateLimiters");
const reset_password_controller_1 = require("../../controllers/reset-password.controller");
const router = express_1.default.Router();
exports.ResetPasswordRouter = router;
router.post('/:token', (0, express_validator_1.param)('token').notEmpty().withMessage('Param token should not be empty'), (0, express_validator_1.body)('password')
    .notEmpty()
    .withMessage('Body Passoword should not be empty')
    .isLength({ min: 5 })
    .withMessage('Password length should not be less than 5.'), 
// rate limiter
rateLimiters_1.resettPasswordAccountLimit, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
reset_password_controller_1.ResetPasswordOne);
