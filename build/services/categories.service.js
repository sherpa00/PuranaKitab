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
exports.GetCategoriesRecentlyAdded = exports.GetCategoriesNewArrivals = exports.GetCategoriesTopRated = exports.GetCategoriesBestSeller = void 0;
const db_configs_1 = require("../configs/db.configs");
const generatePaginationMetadata_1 = __importDefault(require("../helpers/generatePaginationMetadata"));
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
// category service -> Best Seller books
const GetCategoriesBestSeller = (page, size) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // count the best seller books from db for pagination metadata
        const countBestSellerBooks = yield db_configs_1.db.query(`SELECT 
                COUNT(*) 
            FROM 
                books
            INNER JOIN book_sales ON books.bookid = book_sales.bookid
            `);
        // get the best seller books from db
        const getBestSeller = yield db_configs_1.db.query(
        // eslint-disable-next-line quotes
        `SELECT
                books.*,
                authors.firstname AS author_firstname,
                authors.lastname AS author_lastname,
                genres.genre_name,
                front_book_image.img_src AS front_img_src,
                back_book_image.img_src AS back_img_src
            FROM
                books
            LEFT JOIN authors ON books.authorid = authors.authorid
            LEFT JOIN genres ON books.genre_id = genres.genre_id
            LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
            LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
            INNER JOIN book_sales ON books.bookid = book_sales.bookid
            ORDER BY book_sales.sales_count DESC
            LIMIT $1 OFFSET ($2 - 1) * $1;
          `, [size, page]);
        if (getBestSeller.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to get best seller category'
            };
        }
        const getBestSellerPaginationMetaData = (0, generatePaginationMetadata_1.default)(countBestSellerBooks.rows[0].count, page !== null && page !== void 0 ? page : 1, size !== null && size !== void 0 ? size : countBestSellerBooks.rows[0].count);
        return {
            success: true,
            message: 'Successfully got the best seller category',
            data: {
                pagination: Object.assign({}, getBestSellerPaginationMetaData),
                results: getBestSeller.rows
            }
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while getting best seller category');
        return {
            success: false,
            message: 'Failed to get the best seller category'
        };
    }
});
exports.GetCategoriesBestSeller = GetCategoriesBestSeller;
// category service -> Top Rated books
const GetCategoriesTopRated = (page, size) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // count the top rated books for pagination metadata
        const countTopRatedBooks = yield db_configs_1.db.query(`SELECT
                books.bookid,
                COALESCE(AVG(reviews.stars), 0) AS avg_rating
            FROM 
                books
            LEFT JOIN reviews ON books.bookid = reviews.bookid
            GROUP BY books.bookid`);
        // get the top rated books by db
        const getTopRated = yield db_configs_1.db.query(`SELECT
                books.*,
                authors.firstname AS author_firstname,
                authors.lastname AS author_lastname,
                genres.genre_name,
                front_book_image.img_src AS front_img_src,
                back_book_image.img_src AS back_img_src,
                COALESCE(AVG(reviews.stars),0) AS avg_rating
            FROM
                books
            LEFT JOIN reviews ON books.bookid = reviews.bookid
            LEFT JOIN authors ON authors.authorid = books.authorid
            LEFT JOIN genres ON genres.genre_id = books.genre_id
            LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
            LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
            GROUP BY books.bookid, authors.firstname, authors.lastname, genres.genre_name, front_book_image.img_src, back_book_image.img_src
            ORDER BY avg_rating DESC
            LIMIT $1 OFFSET ($2 - 1) * $1`, [size, page]);
        if (getTopRated.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to get top rated category'
            };
        }
        const getTopRatedBooksPaginationMetadata = (0, generatePaginationMetadata_1.default)(countTopRatedBooks.rowCount, page !== null && page !== void 0 ? page : 1, size !== null && size !== void 0 ? size : countTopRatedBooks.rowCount);
        return {
            success: true,
            message: 'Successfully got the top rated category',
            data: {
                pagination: Object.assign({}, getTopRatedBooksPaginationMetadata),
                results: getTopRated.rows
            }
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Errro while getting top rated category');
        return {
            success: false,
            message: 'Failed to get the top rated category'
        };
    }
});
exports.GetCategoriesTopRated = GetCategoriesTopRated;
// category service -> New Arrivals
const GetCategoriesNewArrivals = (page, size) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = new Date();
        const fiveYearsAgo = new Date(currentDate.getFullYear() - 5, 0, 1); // date five years ago
        // count the new arrivals books from db
        const countNewArrivalsBooks = yield db_configs_1.db.query(`SELECT
                COUNT(*)
            FROM
                books
            WHERE books.publication_date BETWEEN $1 AND $2`, [fiveYearsAgo, currentDate]);
        // get the new arrivals from db
        const getNewArrivals = yield db_configs_1.db.query(`SELECT
                books.*,
                authors.firstname AS author_firstname,
                authors.lastname AS author_lastname,
                genres.genre_name,
                front_book_image.img_src AS front_img_src,
                back_book_image.img_src AS back_img_src
            FROM
                books
            LEFT JOIN authors ON authors.authorid = books.authorid
            LEFT JOIN genres ON genres.genre_id = books.genre_id
            LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
            LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
            WHERE books.publication_date BETWEEN $1 AND $2
            ORDER BY books.publication_date DESC
            LIMIT $3 OFFSET ($4 - 1) * $3`, [fiveYearsAgo, currentDate, size, page]);
        if (getNewArrivals.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to get the new arrivals category'
            };
        }
        const getNewArrivalsPaginationMetadata = (0, generatePaginationMetadata_1.default)(countNewArrivalsBooks.rows[0].count, page !== null && page !== void 0 ? page : 1, size !== null && size !== void 0 ? size : countNewArrivalsBooks.rows[0].count);
        return {
            success: true,
            message: 'Successfully got the new arrivals category',
            data: {
                pagination: Object.assign({}, getNewArrivalsPaginationMetadata),
                results: getNewArrivals.rows
            }
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while getting new arrivals category');
        return {
            success: false,
            message: 'Failed to get new arrivals category'
        };
    }
});
exports.GetCategoriesNewArrivals = GetCategoriesNewArrivals;
// category service -> Recently Added
const GetCategoriesRecentlyAdded = (page, size) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = new Date();
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1); // start of current year
        // count the recently added books from db
        const countRecentlyAdded = yield db_configs_1.db.query(`SELECT
                COUNT(*)
            FROM
                books
            WHERE books.createdat BETWEEN $1 AND $2`, [startOfYear, currentDate]);
        // get the new arrivals from db
        const getRecentlyAdded = yield db_configs_1.db.query(`SELECT
                books.*,
                authors.firstname AS author_firstname,
                authors.lastname AS author_lastname,
                genres.genre_name,
                front_book_image.img_src AS front_img_src,
                back_book_image.img_src AS back_img_src
            FROM
                books
            LEFT JOIN authors ON authors.authorid = books.authorid
            LEFT JOIN genres ON genres.genre_id = books.genre_id
            LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
            LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
            WHERE books.createdat BETWEEN $1 AND $2
            ORDER By books.createdat DESC
            LIMIT $3 OFFSET ($4 - 1) * $3`, [startOfYear, currentDate, size, page]);
        if (getRecentlyAdded.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to get the recently added category'
            };
        }
        const getRecentlyAddedPaginationMetadata = (0, generatePaginationMetadata_1.default)(countRecentlyAdded.rows[0].count, page !== null && page !== void 0 ? page : 1, size !== null && size !== void 0 ? size : countRecentlyAdded.rows[0].count);
        return {
            success: true,
            message: 'Successfully got the recently added category',
            data: {
                pagination: Object.assign({}, getRecentlyAddedPaginationMetadata),
                results: getRecentlyAdded.rows
            }
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while getting recently added category');
        return {
            success: false,
            message: 'Failed to get recently added category'
        };
    }
});
exports.GetCategoriesRecentlyAdded = GetCategoriesRecentlyAdded;
