"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const register_controller_1 = __importDefault(require("../controllers/register.controller"));
const rateLimiters_1 = require("../utils/rateLimiters");
const router = express_1.default.Router();
exports.registerRouter = router;
router.post('/', (0, express_validator_1.body)('username').notEmpty().withMessage('Username should not empty'), (0, express_validator_1.body)('email')
    .notEmpty()
    .withMessage('Email should not be empty')
    .isEmail()
    .withMessage('Email should not be invalid'), (0, express_validator_1.body)('password')
    .notEmpty()
    .withMessage('Password should not be empty')
    .isLength({ min: 5 })
    .withMessage('Password length should not be less than 5.'), 
// rate limiters
rateLimiters_1.createAccountLimit, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
register_controller_1.default);
