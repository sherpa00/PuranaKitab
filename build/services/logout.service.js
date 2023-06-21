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
exports.LogOut = void 0;
const db_configs_1 = require("../configs/db.configs");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
// service for logging out
const LogOut = (authenticatedUserId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentTimestamp = Date.now(); // current timestamp
        // change the last_logout date
        const updateLastLogout = yield db_configs_1.db.query('UPDATE users SET last_logout = TO_TIMESTAMP($1 / 1000.0) WHERE userid = $2', [currentTimestamp, authenticatedUserId]);
        if (updateLastLogout.rowCount <= 0) {
            return {
                success: false,
                message: 'No User found'
            };
        }
        return {
            success: true,
            message: 'Successfully Logged out'
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while loggin out');
        return {
            success: false,
            message: 'Error while logging out'
        };
    }
});
exports.LogOut = LogOut;
