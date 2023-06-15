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
exports.RemoveBookImage = exports.UploadBookImage = exports.AddBookImage = exports.RemoveOneBook = exports.UpdateOneBook = exports.GetBookById = exports.GetAllOneBooks = exports.addOneNewBook = void 0;
const books_service_1 = require("../services/books.service");
const http_status_codes_1 = require("http-status-codes");
const express_validator_1 = require("express-validator");
const custom_error_1 = __importDefault(require("../utils/custom-error"));
// controller for getting all books
const GetAllOneBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // call get all books service
        const getAllBooksStatus = yield (0, books_service_1.GetAllBooks)();
        if (!getAllBooksStatus.success) {
            const error = new custom_error_1.default('No Books found', 403);
            throw error;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, getAllBooksStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.GetAllOneBooks = GetAllOneBooks;
// controller for getting a book by id
const GetBookById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // input validation errors
        const BookGetErrors = (0, express_validator_1.validationResult)(req);
        if (!BookGetErrors.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        const getBookByIdStatus = yield (0, books_service_1.GetOnlyOneBook)(parseInt(req.params.bookid));
        if (!getBookByIdStatus.success) {
            const error = new custom_error_1.default('No Book withd id: ' + req.params.bookid + ' found', 404);
            throw error;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, getBookByIdStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.GetBookById = GetBookById;
// controller for adding new book
const addOneNewBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // input validation
        const BookInputErrors = (0, express_validator_1.validationResult)(req);
        if (!BookInputErrors.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { title, price, 
        // eslint-disable-next-line @typescript-eslint/naming-convention
        publication_date, 
        // eslint-disable-next-line @typescript-eslint/naming-convention
        book_type, 
        // eslint-disable-next-line @typescript-eslint/naming-convention
        book_condition, 
        // eslint-disable-next-line @typescript-eslint/naming-convention
        available_quantity, isbn, description, authorFirstname, authorLastname } = req.body;
        // call the add new book service with payload
        const addNewBookStatus = yield (0, books_service_1.AddBook)({
            title,
            price,
            publication_date,
            book_type,
            book_condition,
            available_quantity,
            isbn,
            description
        }, authorFirstname, authorLastname);
        if (!addNewBookStatus.success) {
            const error = new custom_error_1.default('Internal server error', 500);
            throw error;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, addNewBookStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.addOneNewBook = addOneNewBook;
// contrller for updating a book
const UpdateOneBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validatino errors
        const BookUpdateErrors = (0, express_validator_1.validationResult)(req);
        if (!BookUpdateErrors.isEmpty()) {
            const error = new custom_error_1.default('Validation error', 403);
            throw error;
        }
        const { bookid } = req.params;
        const newBookBody = req.body;
        // call the update book service
        const updateOneBookStatus = yield (0, books_service_1.UpdateBook)(parseInt(bookid), newBookBody);
        if (!updateOneBookStatus.success) {
            const error = new custom_error_1.default('Internal server error', 500);
            throw error;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, updateOneBookStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.UpdateOneBook = UpdateOneBook;
// controller for removing a book
const RemoveOneBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const BookDeleteError = (0, express_validator_1.validationResult)(req);
        if (!BookDeleteError.isEmpty()) {
            const error = new custom_error_1.default('Validation error', 403);
            throw error;
        }
        const bookid = parseInt(req.params.bookid);
        // call remove book service
        const removeBookStatus = yield (0, books_service_1.RemoveBookWithId)(bookid);
        if (!removeBookStatus.success) {
            const error = new custom_error_1.default('Internal server error', 500);
            throw error;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, removeBookStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.RemoveOneBook = RemoveOneBook;
// controller for adding book images
const AddBookImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // validationn errors
        const BookInputErrors = (0, express_validator_1.validationResult)(req);
        if (!BookInputErrors.isEmpty()) {
            const errors = new custom_error_1.default('Validation Error', 403);
            throw errors;
        }
        // get the image local path
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        const localImagePath = (_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : '';
        // params and query
        const bookid = parseInt(req.params.bookid);
        const bookImgType = String(req.query.type).toUpperCase();
        // upload the image by calling upload image service
        const imageCloudUploadStatus = yield (0, books_service_1.AddBookImg)(bookid, localImagePath, bookImgType);
        if (!imageCloudUploadStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, imageCloudUploadStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, imageCloudUploadStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.AddBookImage = AddBookImage;
// controller for adding book images
const UploadBookImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        // validation errors
        const BookInputErrors = (0, express_validator_1.validationResult)(req);
        if (!BookInputErrors.isEmpty()) {
            const errors = new custom_error_1.default('Validation Error', 403);
            throw errors;
        }
        // get the image local path
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        const localImagePath = (_d = (_c = req.file) === null || _c === void 0 ? void 0 : _c.path) !== null && _d !== void 0 ? _d : '';
        // params and query
        const bookid = parseInt(req.params.bookid);
        const bookImgType = String(req.query.type).toUpperCase();
        // upload the image by calling upload image service
        const imageCloudUpdateStatus = yield (0, books_service_1.UpdateBookImg)(bookid, localImagePath, bookImgType);
        if (!imageCloudUpdateStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, imageCloudUpdateStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, imageCloudUpdateStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.UploadBookImage = UploadBookImage;
// controller to remove book images
const RemoveBookImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation errors
        const BookInputErrors = (0, express_validator_1.validationResult)(req);
        if (!BookInputErrors.isEmpty()) {
            const errors = new custom_error_1.default('Validation Error', 403);
            throw errors;
        }
        // get params and query
        const bookid = parseInt(req.params.bookid);
        const imgType = String(req.query.type).toUpperCase();
        // call remove book image service
        const removeBookStatus = yield (0, books_service_1.DeleteBookImage)(bookid, imgType);
        if (!removeBookStatus.success) {
            const errors = new custom_error_1.default(removeBookStatus.message, http_status_codes_1.StatusCodes.BAD_REQUEST);
            throw errors;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, removeBookStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.RemoveBookImage = RemoveBookImage;
