"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
exports.UserRouter = router;
router.get('/', 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
user_controller_1.GetOneUserData);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.patch('/username', user_controller_1.UpdateOneUsername);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.patch('/email', user_controller_1.UpdateOneEmail);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.patch('/password', user_controller_1.UpdateOnePassword);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.delete('/', user_controller_1.DeleteOneUser);
