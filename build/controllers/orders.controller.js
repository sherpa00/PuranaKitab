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
exports.RemoveOrderOne = exports.ConfirmOrdersOne = exports.ShowMyOrdersOne = exports.PlaceOrderOnlineOne = exports.PlaceOrderOfflineOne = void 0;
const express_validator_1 = require("express-validator");
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const orders_service_1 = require("../services/orders.service");
const http_status_codes_1 = require("http-status-codes");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
// controller for place order offline
const PlaceOrderOfflineOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation error
        const validationErrors = (0, express_validator_1.validationResult)(req);
        if (!validationErrors.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        // req body
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { carts, phone_number } = req.body;
        // params for place order service
        const authenticatedUser = req.user;
        const authenticatedUserId = authenticatedUser.userid;
        // call place order service
        const placeOrderStatus = yield (0, orders_service_1.PlaceOrderOffline)(carts, authenticatedUserId, phone_number);
        if (!placeOrderStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, placeOrderStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, placeOrderStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.PlaceOrderOfflineOne = PlaceOrderOfflineOne;
// controller for place order online
const PlaceOrderOnlineOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation error
        const validationErrors = (0, express_validator_1.validationResult)(req);
        if (!validationErrors.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            logger_utils_1.default.info(validationErrors.array());
            throw error;
        }
        // req body
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { carts, phone_number } = req.body;
        const cardDetails = {
            cardNumber: req.body.card_details.creditCard,
            expiryMonth: req.body.card_details.expMonth,
            expiryYear: req.body.card_details.expYear,
            cardCVC: req.body.card_details.cvc
        };
        // params for place order service
        const authenticatedUser = req.user;
        const authenticatedUserId = authenticatedUser.userid;
        const authenticatedUserEmail = authenticatedUser.email;
        // call place order service
        const placeOrderStatus = yield (0, orders_service_1.PlaceOrderOnline)(carts, authenticatedUserId, phone_number, authenticatedUserEmail, cardDetails);
        if (!placeOrderStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, placeOrderStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, placeOrderStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.PlaceOrderOnlineOne = PlaceOrderOnlineOne;
// controller for showing orders
const ShowMyOrdersOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // authenticated user
        const authenticatedUser = req.user;
        const authenticatedUserId = authenticatedUser.userid;
        // call show my orders service
        const showMyOrdersStatus = yield (0, orders_service_1.ShowMyOrders)(authenticatedUserId);
        if (!showMyOrdersStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, showMyOrdersStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, showMyOrdersStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.ShowMyOrdersOne = ShowMyOrdersOne;
// controller for confirming orders
const ConfirmOrdersOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // req params
        const orderid = parseInt(req.params.orderid);
        // call confirm orders service
        const confirmOrdersStatus = yield (0, orders_service_1.ConfirmOrders)(orderid);
        if (!confirmOrdersStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, confirmOrdersStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, confirmOrdersStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.ConfirmOrdersOne = ConfirmOrdersOne;
// controller for confirming orders
const RemoveOrderOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // req params
        const orderid = parseInt(req.params.orderid);
        // call remove orders service
        const removeOrderStatus = yield (0, orders_service_1.RemoveOrder)(orderid);
        if (!removeOrderStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, removeOrderStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, removeOrderStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.RemoveOrderOne = RemoveOrderOne;
