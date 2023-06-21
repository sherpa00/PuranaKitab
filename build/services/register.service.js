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
const bcrypt_1 = require("bcrypt");
const db_configs_1 = require("../configs/db.configs");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
// user service to register new user
const RegisterNewUser = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the password salt with rounds 10;
        const salt = yield (0, bcrypt_1.genSalt)(10);
        // prepare hashed password with user given password and salt given above
        const hashedPassword = yield (0, bcrypt_1.hash)(userInfo.password, salt);
        // create new user here with hashed password and salt given
        const reigisterStatus = yield db_configs_1.db.query('INSERT INTO users (username,password,salt,email,role) VALUES ($1,$2,$3,$4,$5) RETURNING *', [userInfo.username, hashedPassword, salt, userInfo.email, 'CUSTOMER']);
        if (reigisterStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to register new user'
            };
        }
        return {
            success: true,
            message: 'Successfully registered new user',
            data: reigisterStatus.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while registering new user');
        return {
            success: false,
            message: 'Error while registering new user'
        };
    }
});
exports.default = RegisterNewUser;
