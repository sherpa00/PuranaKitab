"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../../controllers/user.controller");
const express_validator_1 = require("express-validator");
const passport_config_1 = __importDefault(require("../../configs/passport.config"));
const router = express_1.default.Router();
exports.UserRouter = router;
router.get('/', 
// customer user authentication and authorization
passport_config_1.default.authenticate('jwt', { session: false }), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
user_controller_1.GetOneUserData);
router.patch('/username', (0, express_validator_1.body)('newusername')
    .notEmpty()
    .withMessage('Body newusername should not be empty')
    .isString()
    .withMessage('Body username should be a string'), 
// customer user authentication and authorization
passport_config_1.default.authenticate('jwt', { session: false }), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
user_controller_1.UpdateOneUsername);
router.patch('/email', (0, express_validator_1.body)('newemail')
    .notEmpty()
    .withMessage('Body newemail should not be empty')
    .isEmail()
    .withMessage('Body newemail should be a valid email'), 
// customer user authentication and authorization
passport_config_1.default.authenticate('jwt', { session: false }), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
user_controller_1.UpdateOneEmail);
router.patch('/password', (0, express_validator_1.body)('oldpassword')
    .notEmpty()
    .withMessage('Body oldpassword should not be empty')
    .isLength({ min: 5 })
    .withMessage('Body oldpassword length should be greater than 5'), (0, express_validator_1.body)('newpassword')
    .notEmpty()
    .withMessage('Body newpassword should not be empty')
    .isLength({ min: 5 })
    .withMessage('Body newpassword length should be greater than 5'), 
// customer user authentication and authorization
passport_config_1.default.authenticate('jwt', { session: false }), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
user_controller_1.UpdateOnePassword);
router.delete('/', (0, express_validator_1.body)('password').notEmpty().withMessage('Body Password should not be empty'), 
// customer user authentication and authorization
passport_config_1.default.authenticate('jwt', { session: false }), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
user_controller_1.DeleteOneUser);
