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
exports.GetOneCategoryRecentlyAdded = exports.GetOneCategoryNewArrivals = exports.GetOneCategoryTopRated = exports.GetOneCategoryBestSeller = void 0;
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const express_validator_1 = require("express-validator");
const categories_service_1 = require("../services/categories.service");
const http_status_codes_1 = require("http-status-codes");
// category controller -> Best Seller books
const GetOneCategoryBestSeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation error
        const invalidationError = (0, express_validator_1.validationResult)(req);
        if (!invalidationError.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        // req.queires for pagination page and size
        const page = req.query.page !== undefined && req.query.page !== null ? Number(req.query.page) : 1;
        const size = req.query.size !== undefined && req.query.size !== null ? Number(req.query.size) : 10;
        // call the get best seller service
        const getBestSeller = yield (0, categories_service_1.GetCategoriesBestSeller)(page, size);
        if (!getBestSeller.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, getBestSeller));
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, getBestSeller));
        }
    }
    catch (err) {
        next(err);
    }
});
exports.GetOneCategoryBestSeller = GetOneCategoryBestSeller;
// category controller -> Top Rated
const GetOneCategoryTopRated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation error
        const invalidationError = (0, express_validator_1.validationResult)(req);
        if (!invalidationError.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        // req.queires for pagination page and size
        const page = req.query.page !== undefined && req.query.page !== null ? Number(req.query.page) : 1;
        const size = req.query.size !== undefined && req.query.size !== null ? Number(req.query.size) : 10;
        // call the get top rated service
        const getTopRated = yield (0, categories_service_1.GetCategoriesTopRated)(page, size);
        if (!getTopRated.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, getTopRated));
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, getTopRated));
        }
    }
    catch (err) {
        next(err);
    }
});
exports.GetOneCategoryTopRated = GetOneCategoryTopRated;
// category controller -> new arrivals books
const GetOneCategoryNewArrivals = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation error
        const invalidationError = (0, express_validator_1.validationResult)(req);
        if (!invalidationError.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        // req.queires for pagination page and size
        const page = req.query.page !== undefined && req.query.page !== null ? Number(req.query.page) : 1;
        const size = req.query.size !== undefined && req.query.size !== null ? Number(req.query.size) : 10;
        // call the get new arrivals service
        const getNewArrivals = yield (0, categories_service_1.GetCategoriesNewArrivals)(page, size);
        if (!getNewArrivals.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, getNewArrivals));
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, getNewArrivals));
        }
    }
    catch (err) {
        next(err);
    }
});
exports.GetOneCategoryNewArrivals = GetOneCategoryNewArrivals;
// category controller -> recently added books
const GetOneCategoryRecentlyAdded = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation error
        const invalidationError = (0, express_validator_1.validationResult)(req);
        if (!invalidationError.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        // req.queires for pagination page and size
        const page = req.query.page !== undefined && req.query.page !== null ? Number(req.query.page) : 1;
        const size = req.query.size !== undefined && req.query.size !== null ? Number(req.query.size) : 10;
        // call the get recently added service
        const getRecentlyAdded = yield (0, categories_service_1.GetCategoriesRecentlyAdded)(page, size);
        if (!getRecentlyAdded.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, getRecentlyAdded));
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, getRecentlyAdded));
        }
    }
    catch (err) {
        next(err);
    }
});
exports.GetOneCategoryRecentlyAdded = GetOneCategoryRecentlyAdded;
