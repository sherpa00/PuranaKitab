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
exports.SearchBooks = void 0;
/* eslint-disable quotes */
const db_configs_1 = require("../configs/db.configs");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
const generatePaginationMetadata_1 = __importDefault(require("../helpers/generatePaginationMetadata"));
const convertSortByToDbOrderBy_1 = require("../helpers/convertSortByToDbOrderBy");
// service for searching books
const SearchBooks = (searchQuery, searchBy, searchGenre, searchPage, searchSize, searchSortBy, searchBookCondition, searchMinPrice, searchMaxPrice) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // db search with search query and search by
        let searchResults;
        let countSearchResults;
        // cover searchSort to db order by json values
        const orderByJson = (0, convertSortByToDbOrderBy_1.convertToDbOrderBy)(searchSortBy);
        if (searchBy === 'title') {
            // get total search results
            countSearchResults = yield db_configs_1.db.query(`SELECT COUNT(*) FROM books
          LEFT JOIN genres ON books.genre_id = genres.genre_id
          LEFT JOIN authors on books.authorid = authors.authorid
            WHERE books.title ILIKE '%' || $1 || '%' 
              AND (genres.genre_name = $2 OR $2 IS NULL)
                AND (books.book_condition = $3 OR $3 IS NULL)
                  AND (books.price >= $4 OR $4 IS NULL)
                    AND (books.price <= $5 OR $5 IS NULL)`, [searchQuery, searchGenre, searchBookCondition, searchMinPrice, searchMaxPrice]);
            searchResults = yield db_configs_1.db.query(`SELECT books.* ${orderByJson.select_by}, genres.genre_name, authors.firstname AS author_firstname, authors.lastname AS author_lastname, front_book_image.img_src AS front_img_src, back_book_image AS back_img_src FROM books
          LEFT JOIN genres ON books.genre_id = genres.genre_id
          LEFT JOIN authors ON books.authorid = authors.authorid
          LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
          LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
          ${orderByJson.left_join}
            WHERE books.title ILIKE '%' || $1 || '%' AND (genres.genre_name = $2 OR $2 IS NULL) 
            AND (books.book_condition = $3 OR $3 IS NULL)
            AND (books.price >= $4 OR $4 IS NULL)
            AND (books.price <= $5 OR $5 IS NULL)
            ${orderByJson.group_by}
              ${orderByJson.order_by}
                LIMIT $6 OFFSET ($7 - 1) * $6`, [searchQuery, searchGenre, searchBookCondition, searchMinPrice, searchMaxPrice, searchSize, searchPage]);
        }
        else if (searchBy === 'author') {
            // get total search results
            countSearchResults = yield db_configs_1.db.query(`SELECT COUNT(*) FROM books
          INNER JOIN authors ON books.authorid = authors.authorid
          LEFT JOIN genres ON books.genre_id = genres.genre_id 
            WHERE CONCAT(authors.firstname, ' ', authors.lastname) ILIKE '%' || $1 || '%' 
              AND (genres.genre_name = $2 OR $2 IS NULL)
                AND (books.book_condition = $3 OR $3 IS NULL)
                  AND (books.price >= $4 OR $4 IS NULL)
                    AND (books.price <= $5 OR $5 IS NULL)`, [searchQuery, searchGenre, searchBookCondition, searchMinPrice, searchMaxPrice]);
            // search in authors
            searchResults = yield db_configs_1.db.query(`SELECT books.* ${orderByJson.select_by},genres.genre_name,authors.firstname AS author_firstname, authors.lastname AS author_lastname, front_book_image.img_src AS front_img_src, back_book_image AS back_img_src FROM books
           INNER JOIN authors ON books.authorid = authors.authorid
           LEFT JOIN genres ON books.genre_id = genres.genre_id 
           LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
          LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
          ${orderByJson.left_join}
            WHERE CONCAT(authors.firstname, ' ', authors.lastname) ILIKE '%' || $1 || '%' 
            AND (genres.genre_name = $2 OR $2 IS NULL) 
            AND (books.book_condition = $3 OR $3 IS NULL)
            AND (books.price >= $4 OR $4 IS NULL)
            AND (books.price <= $5 OR $5 IS NULL)
            ${orderByJson.group_by}
            ${orderByJson.order_by}
              LIMIT $6 OFFSET ($7 - 1) * $6`, [searchQuery, searchGenre, searchBookCondition, searchMinPrice, searchMaxPrice, searchSize, searchPage]);
        }
        else if (searchBy === 'description') {
            // get search results count
            countSearchResults = yield db_configs_1.db.query(`SELECT COUNT(*) FROM books 
          LEFT JOIN genres ON books.genre_id = genres.genre_id
          LEFT JOIN authors ON books.authorid = authors.authorid
            WHERE to_tsvector('simple', books.description) @@ to_tsquery('simple', $1) 
              AND (genres.genre_name = $2 OR $2 IS NULL)
                AND (books.book_condition = $3 OR $3 IS NULL)
                  AND (books.price >= $4 OR $4 IS NULL)
                    AND (books.price <= $5 OR $5 IS NULL)`, [searchQuery, searchGenre, searchBookCondition, searchMinPrice, searchMaxPrice]);
            searchResults = yield db_configs_1.db.query(`SELECT books.* ${orderByJson.select_by},genres.genre_name,authors.firstname AS author_firstname, authors.lastname AS author_lastname, front_book_image.img_src AS front_img_src, back_book_image AS back_img_src FROM books 
          LEFT JOIN genres ON books.genre_id = genres.genre_id
          LEFT JOIN authors on books.authorid = authors.authorid
          LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
          LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
          ${orderByJson.left_join}
            WHERE to_tsvector('simple', books.description) @@ to_tsquery('simple', $1) 
            AND (genres.genre_name = $2 OR $2 IS NULL) 
            AND (books.book_condition = $3 OR $3 IS NULL)
            AND (books.price >= $4 OR $4 IS NULL)
            AND (books.price <= $5 OR $5 IS NULL)
            ${orderByJson.group_by}
            ${orderByJson.order_by}
              LIMIT $6 OFFSET ($7 - 1) * $6`, [searchQuery, searchGenre, searchBookCondition, searchMinPrice, searchMaxPrice, searchSize, searchPage]);
        }
        else {
            return {
                success: false,
                message: 'Books search by invalid'
            };
        }
        if (countSearchResults.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to search books'
            };
        }
        if ((searchResults === null || searchResults === void 0 ? void 0 : searchResults.rowCount) < 0) {
            return {
                success: false,
                message: 'Failed to search books'
            };
        }
        // pagination metadata for books search
        const searchPaginationMetadata = (0, generatePaginationMetadata_1.default)(countSearchResults.rows[0].count, searchPage, searchSize);
        return {
            success: true,
            message: 'Successfully searched books',
            data: {
                pagination: Object.assign({}, searchPaginationMetadata),
                results: searchResults.rows
            }
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while search books');
        return {
            success: false,
            message: 'Failed to search books'
        };
    }
});
exports.SearchBooks = SearchBooks;
