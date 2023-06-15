"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutRouter = void 0;
const express_1 = __importDefault(require("express"));
const logout_controller_1 = require("../controllers/logout.controller");
const passport_config_1 = __importDefault(require("../configs/passport.config"));
const router = express_1.default.Router();
exports.LogoutRouter = router;
router.get('/', passport_config_1.default.authenticate('jwt', { session: false }), 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
logout_controller_1.LogOutOne);
