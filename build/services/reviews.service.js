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
exports.RemoveAllReviews = exports.RemoveSinlgeReview = exports.GetAllReviews = exports.AddReview = void 0;
const db_configs_1 = require("../configs/db.configs");
// service for gettting all reviews for book
const GetAllReviews = (bookID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // show if book exits or not
        const foundBook = yield db_configs_1.db.query(`SELECT * FROM books WHERE books.bookid = $1`, [bookID]);
        if (foundBook.rowCount <= 0) {
            return {
                success: false,
                message: 'No Book Found'
            };
        }
        // get all book review
        const foundBookReview = yield db_configs_1.db.query(`SELECT * FROM reviews WHERE reviews.bookid = $1`, [bookID]);
        if (foundBookReview.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to get all book reviews'
            };
        }
        if (foundBookReview.rowCount === 0) {
            return {
                success: true,
                message: 'Successfully got all book reviews',
                data: []
            };
        }
        return {
            success: true,
            message: 'Successfully got all book reviews',
            data: foundBookReview.rows
        };
    }
    catch (err) {
        console.log(err);
        return {
            success: false,
            message: 'Error while gettting all book reviews'
        };
    }
});
exports.GetAllReviews = GetAllReviews;
// service for adding reviews for book
const AddReview = (userID, bookID, userName, reviewStars, reviewMessage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // verify if book exits or not
        const foundBook = yield db_configs_1.db.query(`SELECT * FROM books WHERE bookid = $1`, [bookID]);
        if (foundBook.rowCount <= 0) {
            return {
                success: false,
                message: 'No Book Found'
            };
        }
        // verify if already reviews exits for same user and book
        const reviewsFound = yield db_configs_1.db.query(`SELECT * FROM reviews WHERE userid = $1 AND bookid = $2`, [userID, bookID]);
        if (reviewsFound.rowCount > 0) {
            return {
                success: false,
                message: 'Already reviewed book'
            };
        }
        // add reviews
        const bookReviewAddStatus = yield db_configs_1.db.query(`INSERT INTO reviews(userid, bookid, username, stars, message) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [userID, bookID, userName, reviewStars, reviewMessage]);
        if (bookReviewAddStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to add book review'
            };
        }
        return {
            success: true,
            message: 'Successfully added book review',
            data: bookReviewAddStatus.rows[0]
        };
    }
    catch (err) {
        console.log(err);
        return {
            success: false,
            message: 'Error while adding book review'
        };
    }
});
exports.AddReview = AddReview;
// servie for removing single book reivew
const RemoveSinlgeReview = (reviewID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check if book reviews exits or not
        const foundReview = yield db_configs_1.db.query(`SELECT * FROM reviews WHERE reviews.reviewid = $1`, [reviewID]);
        if (foundReview.rowCount <= 0) {
            return {
                success: false,
                message: 'No book reviews found'
            };
        }
        // remove book reivew
        const removeBookReviewStatus = yield db_configs_1.db.query(`DELETE FROM reviews WHERE reviews.reviewid = $1 RETURNING *`, [
            reviewID
        ]);
        if (removeBookReviewStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to remove book review'
            };
        }
        return {
            success: true,
            message: 'Successfully removed book review',
            data: removeBookReviewStatus.rows[0]
        };
    }
    catch (err) {
        console.log(err);
        return {
            success: false,
            message: 'Error while removing book reivew'
        };
    }
});
exports.RemoveSinlgeReview = RemoveSinlgeReview;
// service for removing all book reviews for book
const RemoveAllReviews = (bookID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // verify if book exits or not
        const bookFound = yield db_configs_1.db.query(`SELECT * FROM books WHERE books.bookid = $1`, [bookID]);
        if (bookFound.rowCount <= 0) {
            return {
                success: false,
                message: 'No Book Found'
            };
        }
        // revove book reviews
        const removeBookReviewsStatus = yield db_configs_1.db.query(`DELETE FROM reviews WHERE bookid = $1 RETURNING *`, [bookID]);
        if (removeBookReviewsStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to remove all book reviews'
            };
        }
        return {
            success: true,
            message: 'Successfully removed all book reviews',
            data: removeBookReviewsStatus.rows
        };
    }
    catch (err) {
        console.log(err);
        return {
            success: false,
            message: 'Error while removing all book reviews'
        };
    }
});
exports.RemoveAllReviews = RemoveAllReviews;
