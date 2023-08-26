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
exports.SearchBooksOne = void 0;
const express_validator_1 = require("express-validator");
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const search_service_1 = require("../services/search.service");
const http_status_codes_1 = require("http-status-codes");
// contoller for searching books
const SearchBooksOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation error
        const validationError = (0, express_validator_1.validationResult)(req);
        if (!validationError.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        // req.query
        const searchQuery = String(req.query.query);
        const searchBy = String(req.query.search_by);
        const searchGenre = req.query.genre;
        const searchPage = req.query.page !== null && req.query.page !== undefined ? Number(req.query.page) : 1;
        const searchSize = req.query.size !== null && req.query.size !== undefined ? Number(req.query.size) : 10;
        const searchSortBy = req.query.sort_by != null && req.query.sort_by !== undefined ? String(req.query.sort_by) : 'most_reviewed';
        const searchBookCondition = req.query.condition !== null && req.query.condition !== undefined
            ? String(req.query.condition).toUpperCase()
            : req.query.condition;
        const searchMinPrice = req.query.min_price !== null && req.query.min_price !== undefined
            ? Number(req.query.min_price)
            : req.query.min_price;
        const searchMaxPrice = req.query.max_price !== null && req.query.max_price !== undefined
            ? Number(req.query.max_price)
            : req.query.max_price;
        // call search books service
        const searchBooksStatus = yield (0, search_service_1.SearchBooks)(searchQuery, searchBy, searchGenre, searchPage, searchSize, searchSortBy, searchBookCondition, searchMinPrice, searchMaxPrice);
        if (!searchBooksStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, searchBooksStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, searchBooksStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.SearchBooksOne = SearchBooksOne;
