"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_configs_1 = require("../configs/db.configs");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const SECRET = process.env.SECRET;
const LoginUser = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // first find if userame exits
        const foundUser = yield db_configs_1.db.query('SELECT * FROM users WHERE email = $1', [userInfo.email]);
        if (foundUser.rowCount <= 0) {
            return {
                success: false,
                message: 'No user found'
            };
        }
        // verify user's password
        const isVerified = (0, bcrypt_1.compareSync)(userInfo.password, foundUser.rows[0].password);
        if (!isVerified) {
            return {
                success: false,
                message: 'Invalid Password'
            };
        }
        // sign new token
        const token = (0, jsonwebtoken_1.sign)({ sub: foundUser.rows[0].userid, subRole: foundUser.rows[0].role, subPass: foundUser.rows[0].password }, SECRET, {
            expiresIn: '1h'
        });
        return {
            success: true,
            token,
            data: foundUser.rows[0],
            message: 'Successfully LoggedIn'
        };
    }
    catch (err) {
        console.log(err);
        console.log('Error while loggin in');
        return {
            success: false,
            message: 'Error while loggin in'
        };
    }
});
exports.default = LoginUser;
