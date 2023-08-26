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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv = __importStar(require("dotenv"));
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
dotenv.config({
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    path: `.env.${process.env.NODE_ENV}`
});
// function to send reset email
const sendResetEmail = (receiverEmail, resetToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const resetLink = `http://localhost:3003/api/reset-password/${resetToken}`;
        const transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.DEFAULT_GMAIL,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });
        const mailOptions = {
            from: String(process.env.DEFAULT_EMAIL),
            to: receiverEmail,
            subject: 'RESET PASSWORD',
            text: 'Reset link is given to reset password',
            html: `<h3>
                You requested a reset password so please visit <a href='${resetLink}'>${resetLink}</a> to reset your password.
                </h3>`
        };
        // send email
        yield transporter.sendMail(mailOptions);
        return {
            success: true,
            message: 'Successfully sent reset email'
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while sending reset email');
        return {
            success: false,
            message: 'Error while sending reset email'
        };
    }
});
exports.default = sendResetEmail;
