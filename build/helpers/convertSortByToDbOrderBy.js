"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToDbOrderBy = void 0;
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
// helper function to convert req.query sort_by value to acceptable db order_by json values
const convertToDbOrderBy = (sortBy) => {
    try {
        let resultOrderBy = {
            select_by: '',
            left_join: '',
            group_by: '',
            order_by: ''
        };
        switch (sortBy) {
            case 'most_reviewed':
                resultOrderBy = {
                    select_by: ', CAST(COUNT(reviews.reviewid) AS integer) AS review_count',
                    left_join: 'LEFT JOIN reviews ON books.bookid = reviews.bookid',
                    group_by: 'GROUP BY books.bookid, genres.genre_id, authors.firstname, authors.lastname, reviews.reviewid, front_book_image.img_src, back_book_image.img_src,front_book_image.*, back_book_image.*',
                    order_by: 'ORDER BY review_count DESC'
                };
                break;
            case 'least_reviewed':
                resultOrderBy = {
                    select_by: ', CAST(COUNT(reviews.reviewid) AS integer) AS review_count',
                    left_join: 'LEFT JOIN reviews ON books.bookid = reviews.bookid',
                    group_by: 'GROUP BY books.bookid,genres.genre_id, authors.firstname, authors.lastname, reviews.reviewid, front_book_image.img_src, back_book_image.img_src,front_book_image.*, back_book_image.*',
                    order_by: 'ORDER BY review_count ASC'
                };
                break;
            case 'alphabetically_asc':
                resultOrderBy = {
                    select_by: '',
                    left_join: '',
                    group_by: '',
                    order_by: 'ORDER BY books.title ASC'
                };
                break;
            case 'alphabetically_desc':
                resultOrderBy = {
                    select_by: '',
                    left_join: '',
                    group_by: '',
                    order_by: 'ORDER BY books.title DESC'
                };
                break;
            case 'price_high':
                resultOrderBy = {
                    select_by: '',
                    left_join: '',
                    group_by: '',
                    order_by: 'ORDER BY books.price DESC'
                };
                break;
            case 'price_low':
                resultOrderBy = {
                    select_by: '',
                    left_join: '',
                    group_by: '',
                    order_by: 'ORDER BY books.price ASC'
                };
                break;
            case 'newest':
                resultOrderBy = {
                    select_by: '',
                    left_join: '',
                    group_by: '',
                    order_by: 'ORDER BY books.createdat DESC'
                };
                break;
            case 'oldest':
                resultOrderBy = {
                    select_by: '',
                    left_join: '',
                    group_by: '',
                    order_by: 'ORDER BY books.createdat ASC'
                };
                break;
        }
        return resultOrderBy;
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while converting req.query sort_by to db order_by json');
        return {
            select_by: '',
            left_join: '',
            group_by: '',
            order_by: ''
        };
    }
};
exports.convertToDbOrderBy = convertToDbOrderBy;
