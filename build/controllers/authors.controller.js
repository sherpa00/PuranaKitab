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
exports.RemoveOneAuthor = exports.UpdateOneAuthor = exports.AddNewBookOneAuthor = exports.GetAllBookOneAuthors = exports.capitalize = void 0;
const http_status_codes_1 = require("http-status-codes");
const express_validator_1 = require("express-validator");
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const authors_service_1 = require("../services/authors.service");
// funciton to capitalize
const capitalize = (word) => {
    return word[0].toUpperCase() + word.slice(1);
};
exports.capitalize = capitalize;
// controller for getting all book authors
const GetAllBookOneAuthors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // valiation error
        const validationError = (0, express_validator_1.validationResult)(req);
        if (!validationError.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        let getAllBooksAuthorsStatus;
        // call get all book authors
        if ((req.query.page === null || req.query.page === undefined) &&
            (req.query.size === null || req.query.size === undefined)) {
            // pagination is not provied
            // call get all books authors without pagination
            getAllBooksAuthorsStatus = yield (0, authors_service_1.GetAllBookAuthors)();
        }
        else {
            // pagination provided either page or size or both
            const page = req.query.page !== null && req.query.page !== undefined ? Number(req.query.page) : 1;
            const size = req.query.size !== null && req.query.size !== undefined ? Number(req.query.size) : 10;
            // call get all books authors service with pagination
            getAllBooksAuthorsStatus = yield (0, authors_service_1.GetAllBookAuthors)(page, size);
        }
        if (!getAllBooksAuthorsStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, getAllBooksAuthorsStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, getAllBooksAuthorsStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.GetAllBookOneAuthors = GetAllBookOneAuthors;
// controller for adding new book author
const AddNewBookOneAuthor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation error
        const validationError = (0, express_validator_1.validationResult)(req);
        if (!validationError.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        // req body -> sanitize it to lowercase and capitalize
        const firsname = (0, exports.capitalize)(String(req.body.firstname).toLowerCase());
        const lastname = (0, exports.capitalize)(String(req.body.lastname).toLowerCase());
        // call add new book author service
        const addNewBookAuthorStatus = yield (0, authors_service_1.AddNewBookAuthor)(firsname, lastname);
        if (!addNewBookAuthorStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, addNewBookAuthorStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, addNewBookAuthorStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.AddNewBookOneAuthor = AddNewBookOneAuthor;
// controller for updating book author
const UpdateOneAuthor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation error
        const validationError = (0, express_validator_1.validationResult)(req);
        if (!validationError.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        // req.params
        const authorID = Number(req.params.authorid);
        // req body -> capitalize if defined
        let newFirstname = req.body.firstname;
        let newLastname = req.body.lastname;
        if (req.body.firstname !== null && req.body.firstname !== undefined) {
            newFirstname = (0, exports.capitalize)(String(newFirstname).toLowerCase());
        }
        if (req.body.lastname !== null && req.body.lastname !== undefined) {
            newLastname = (0, exports.capitalize)(String(newLastname).toLowerCase());
        }
        // call update book author service
        const updateBookAuthorStatus = yield (0, authors_service_1.UpdateAuthor)(authorID, newFirstname, newLastname);
        if (!updateBookAuthorStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, updateBookAuthorStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, updateBookAuthorStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.UpdateOneAuthor = UpdateOneAuthor;
// controller for removing book author
const RemoveOneAuthor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation error
        const validationError = (0, express_validator_1.validationResult)(req);
        if (!validationError.isEmpty()) {
            const error = new custom_error_1.default('Validation Error', 403);
            throw error;
        }
        // req params
        const authorID = Number(req.params.authorid);
        // call remove author service
        const removeAuthorStatus = yield (0, authors_service_1.RemoveAuthor)(authorID);
        if (!removeAuthorStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, removeAuthorStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, removeAuthorStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.RemoveOneAuthor = RemoveOneAuthor;
