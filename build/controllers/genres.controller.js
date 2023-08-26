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
exports.DeleteOneGenre = exports.UpdateOneGenre = exports.AddBookOneGenre = exports.GetBookOneGenres = void 0;
const express_validator_1 = require("express-validator");
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const genres_service_1 = require("../services/genres.service");
const http_status_codes_1 = require("http-status-codes");
const authors_controller_1 = require("./authors.controller");
// controller for getting all book genres
const GetBookOneGenres = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationError = (0, express_validator_1.validationResult)(req);
        if (!validationError.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        let getBookGenresStatus;
        // req queres
        let page = req.query.page;
        let size = req.query.size;
        if ((page === undefined || page === null) && size === undefined && size === null) {
            // pagination is not provided
            // call get book genres service without page and size
            getBookGenresStatus = yield (0, genres_service_1.GetBookGenres)();
        }
        else {
            // pagination provided either page or size or both
            page = page !== null && page !== undefined ? Number(page) : 1;
            size = size !== null && size !== undefined ? Number(size) : 10;
            // call get book genres service with page and size
            getBookGenresStatus = yield (0, genres_service_1.GetBookGenres)(page, size);
        }
        if (!getBookGenresStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, getBookGenresStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, getBookGenresStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.GetBookOneGenres = GetBookOneGenres;
// controller for adding book genres
const AddBookOneGenre = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation error
        const validationError = (0, express_validator_1.validationResult)(req);
        if (!validationError.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        // req body -> capitalize
        const genreName = (0, authors_controller_1.capitalize)(req.body.genre);
        // call add book genre service
        const addBookGenreStatus = yield (0, genres_service_1.AddBookGenre)(genreName);
        if (!addBookGenreStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, addBookGenreStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, addBookGenreStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.AddBookOneGenre = AddBookOneGenre;
// controller for updating book genres
const UpdateOneGenre = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation error
        const validationError = (0, express_validator_1.validationResult)(req);
        if (!validationError.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        // req query
        const genreID = Number(req.params.genreid);
        // req body -> capitalize
        const newGenreName = (0, authors_controller_1.capitalize)(req.body.genre);
        // call update book genre service
        const updateBookGenreStatus = yield (0, genres_service_1.UpdateGenre)(genreID, newGenreName);
        if (!updateBookGenreStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, updateBookGenreStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, updateBookGenreStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.UpdateOneGenre = UpdateOneGenre;
// controller for deleting book genres
const DeleteOneGenre = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation error
        const validationError = (0, express_validator_1.validationResult)(req);
        if (!validationError.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        // req query
        const genreID = Number(req.params.genreid);
        // call delete book genre service
        const deleteBookGenreStatus = yield (0, genres_service_1.DeleteGenre)(genreID);
        if (!deleteBookGenreStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, deleteBookGenreStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, deleteBookGenreStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.DeleteOneGenre = DeleteOneGenre;
