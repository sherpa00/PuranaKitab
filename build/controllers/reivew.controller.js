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
exports.RemoveAllOneBookReviews = exports.RemoveSingleOneBookReview = exports.GetAllOneBookReview = exports.AddOneReview = void 0;
const express_validator_1 = require("express-validator");
const http_status_codes_1 = require("http-status-codes");
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const reviews_service_1 = require("../services/reviews.service");
const GetAllOneBookReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validationn error
        const reviewInputErrors = (0, express_validator_1.validationResult)(req);
        if (!reviewInputErrors.isEmpty()) {
            const error = new custom_error_1.default('Validation Errors', 403);
            throw error;
        }
        // req body
        const bookID = parseInt(req.body.bookid);
        // call get all book reviews service
        const gotAllBookReviews = yield (0, reviews_service_1.GetAllReviews)(bookID);
        if (!gotAllBookReviews.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, gotAllBookReviews));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, gotAllBookReviews));
    }
    catch (err) {
        next(err);
    }
});
exports.GetAllOneBookReview = GetAllOneBookReview;
// controller to add book review
const AddOneReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation errors
        const reviewInputErrors = (0, express_validator_1.validationResult)(req);
        if (!reviewInputErrors.isEmpty()) {
            const error = new custom_error_1.default('Validation Errors', 403);
            throw error;
        }
        // get authenticated user and userid
        const authenticatedUserData = req.user;
        const authenticatedUserId = authenticatedUserData.userid;
        const authenticatedUserName = authenticatedUserData.username;
        // req body
        const bookID = parseInt(req.body.bookid);
        const reviewStars = parseInt(req.body.stars);
        const reviewMessage = String(req.body.message);
        // call add book review
        const addBookReviewStatus = yield (0, reviews_service_1.AddReview)(authenticatedUserId, bookID, authenticatedUserName, reviewStars, reviewMessage);
        if (!addBookReviewStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, addBookReviewStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, addBookReviewStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.AddOneReview = AddOneReview;
// controllers for removing all book reviews
const RemoveSingleOneBookReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation errors
        const reviewInputErrors = (0, express_validator_1.validationResult)(req);
        if (!reviewInputErrors.isEmpty()) {
            const error = new custom_error_1.default('Validation Errors', 403);
            throw error;
        }
        // req params
        const reviewID = parseInt(req.params.reviewid);
        // call remove all book reviews service
        const removeBookReviewStatus = yield (0, reviews_service_1.RemoveSinlgeReview)(reviewID);
        if (!removeBookReviewStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, removeBookReviewStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, removeBookReviewStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.RemoveSingleOneBookReview = RemoveSingleOneBookReview;
// controllers for removing all book reviews
const RemoveAllOneBookReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validation errors
        const reviewInputErrors = (0, express_validator_1.validationResult)(req);
        if (!reviewInputErrors.isEmpty()) {
            const error = new custom_error_1.default('Validation Errors', 403);
            throw error;
        }
        // req body
        const bookID = parseInt(req.body.bookid);
        // call remove all book reviews service
        const removeBookReviewsStatus = yield (0, reviews_service_1.RemoveAllReviews)(bookID);
        if (!removeBookReviewsStatus.success) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(Object.assign({}, removeBookReviewsStatus));
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, removeBookReviewsStatus));
    }
    catch (err) {
        next(err);
    }
});
exports.RemoveAllOneBookReviews = RemoveAllOneBookReviews;
