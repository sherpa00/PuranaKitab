"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const login_controller_1 = __importDefault(require("../controllers/login.controller"));
const rateLimiters_1 = require("../utils/rateLimiters");
const router = express_1.default.Router();
exports.loginRouter = router;
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/', (0, express_validator_1.body)('email').notEmpty().withMessage('Email should not be empty'), (0, express_validator_1.body)('password').notEmpty().withMessage('Password should not be empty'), 
// rate limiter,
rateLimiters_1.loginAccountLimit, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
login_controller_1.default);
