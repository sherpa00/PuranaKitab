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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogOutOne = void 0;
const http_status_codes_1 = require("http-status-codes");
const logout_service_1 = require("../services/logout.service");
// controller for logout
const LogOutOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the authenticated userid
        const authenticatedUserData = req.user;
        const authenticatedUserId = authenticatedUserData.userid;
        // call the logout service
        const LogOutStatus = yield (0, logout_service_1.LogOut)(authenticatedUserId);
        if (!LogOutStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, LogOutStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, LogOutStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.LogOutOne = LogOutOne;
