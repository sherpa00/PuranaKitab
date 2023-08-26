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
exports.RemoveAuthor = exports.UpdateAuthor = exports.AddNewBookAuthor = exports.GetAllBookAuthors = void 0;
/* eslint-disable quotes */
const db_configs_1 = require("../configs/db.configs");
const generatePaginationMetadata_1 = __importDefault(require("../helpers/generatePaginationMetadata"));
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
// service to get all book services
const GetAllBookAuthors = (page, size) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // count authors
        const getBookAuthorsCount = yield db_configs_1.db.query(`SELECT COUNT(*) FROM authors`);
        if (getBookAuthorsCount.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to get all book authors'
            };
        }
        let getBookAuthorsStatus;
        if (page !== null && page !== undefined && size !== null && size !== undefined) {
            // pagination is given
            // eslint-disable-next-line quotes
            getBookAuthorsStatus = yield db_configs_1.db.query(`SELECT *,CONCAT(authors.firstname, ' ', authors.lastname) AS fullname  FROM authors ORDER BY CONCAT(authors.firstname, ' ', authors.lastname) ASC LIMIT $1 OFFSET ($2 - 1) * $1`, [size, page]);
        }
        else {
            // pagination not given
            getBookAuthorsStatus = yield db_configs_1.db.query(`SELECT *,CONCAT(authors.firstname, ' ', authors.lastname) AS fullname FROM authors ORDER BY CONCAT(authors.firstname, ' ', authors.lastname)`);
        }
        if (getBookAuthorsStatus.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to get all book authors'
            };
        }
        // genreate paginaton metadata
        const getBookAuthorsPaginationMetadata = (0, generatePaginationMetadata_1.default)(getBookAuthorsCount.rows[0].count, page !== null && page !== undefined ? page : 1, size !== null && size !== undefined ? size : getBookAuthorsCount.rows[0].count);
        return {
            success: true,
            message: 'Successfully got all book authors',
            data: {
                pagination: Object.assign({}, getBookAuthorsPaginationMetadata),
                results: getBookAuthorsStatus.rows
            }
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while getting all book authors');
        return {
            success: false,
            message: 'Failed to get all book authors'
        };
    }
});
exports.GetAllBookAuthors = GetAllBookAuthors;
// service for adding new book authors
const AddNewBookAuthor = (firstname, lastname) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // verify if book authors already exists or not
        const foundBookAuthor = yield db_configs_1.db.query('SELECT COUNT(*) FROM authors WHERE authors.firstname = $1 AND authors.lastname = $2', [firstname, lastname]);
        if (foundBookAuthor.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to add new book author'
            };
        }
        if (foundBookAuthor.rows[0].count > 0) {
            return {
                success: false,
                message: 'Book Author already exists'
            };
        }
        // add new book authors
        const addNewBookAuthorStatus = yield db_configs_1.db.query('INSERT INTO authors (firstname, lastname) VALUES ($1, $2) RETURNING *', [firstname, lastname]);
        if (addNewBookAuthorStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to add new book author'
            };
        }
        return {
            success: true,
            message: 'Successfully added new book author',
            data: addNewBookAuthorStatus.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while adding new book author');
        return {
            success: false,
            message: 'Failed to add new book author'
        };
    }
});
exports.AddNewBookAuthor = AddNewBookAuthor;
// service to update book authors
const UpdateAuthor = (authorid, firstname, lastname) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // verify if book authors already exists or not
        const foundBookAuthor = yield db_configs_1.db.query('SELECT * FROM authors WHERE authors.authorid = $1', [authorid]);
        if (foundBookAuthor.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to update book author'
            };
        }
        if (foundBookAuthor.rowCount === 0) {
            return {
                success: false,
                message: 'Book Author is not available'
            };
        }
        // set missing values
        const newFirstname = firstname !== null && firstname !== undefined ? firstname : foundBookAuthor.rows[0].firstname;
        const newLastname = lastname !== null && lastname !== undefined ? lastname : foundBookAuthor.rows[0].lastname;
        // update book author
        const updateBookAuthorStatus = yield db_configs_1.db.query(`UPDATE authors SET firstname = $1, lastname = $2 WHERE authors.authorid = $3 RETURNING *`, [newFirstname, newLastname, authorid]);
        if (updateBookAuthorStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to update book author'
            };
        }
        return {
            success: true,
            message: 'Successfully updated book author',
            data: updateBookAuthorStatus.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while updating book author');
        return {
            success: false,
            message: 'Failed to update book author'
        };
    }
});
exports.UpdateAuthor = UpdateAuthor;
// service for removing book author
const RemoveAuthor = (authorid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // verify if book author exist or not
        const foundBookAuthor = yield db_configs_1.db.query('SELECT COUNT(*) FROM authors WHERE authors.authorid = $1', [authorid]);
        if (foundBookAuthor.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to remove book author'
            };
        }
        if (foundBookAuthor.rows[0].count === 0) {
            return {
                success: false,
                message: 'Book Author is not available'
            };
        }
        // remove author
        const removeAuthorStatus = yield db_configs_1.db.query('DELETE FROM authors WHERE authors.authorid = $1 RETURNING *', [authorid]);
        if (removeAuthorStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to remove book author'
            };
        }
        return {
            success: true,
            message: 'Successfully removed book author',
            data: removeAuthorStatus.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while removing book author');
        return {
            success: false,
            message: 'Failed to remove book author'
        };
    }
});
exports.RemoveAuthor = RemoveAuthor;
