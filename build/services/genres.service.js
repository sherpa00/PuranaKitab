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
exports.DeleteGenre = exports.UpdateGenre = exports.AddBookGenre = exports.GetBookGenres = void 0;
const db_configs_1 = require("../configs/db.configs");
const generatePaginationMetadata_1 = __importDefault(require("../helpers/generatePaginationMetadata"));
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
// service to get all book genres
const GetBookGenres = (page, size) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // count book genres
        const countBookGenres = yield db_configs_1.db.query('SELECT COUNT(*) FROM genres');
        if (countBookGenres.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to get book genres'
            };
        }
        // get book genres
        let getBookGenresStatus;
        if (page !== undefined && page !== null && size !== undefined && page !== null) {
            // pagination given
            getBookGenresStatus = yield db_configs_1.db.query('SELECT * FROM genres ORDER BY genres.genre_name ASC LIMIT $1 OFFSET ($2 - 1) * $1', [size, page]);
        }
        else {
            // pagination not given
            getBookGenresStatus = yield db_configs_1.db.query('SELECT * FROM genres ORDER BY genres.genre_name ASC');
        }
        // genreate pagination metadata
        const getBookGenresPaginationMetadata = (0, generatePaginationMetadata_1.default)(countBookGenres.rows[0].count, page !== null && page !== void 0 ? page : 1, size !== null && size !== void 0 ? size : countBookGenres.rows[0].count);
        return {
            success: true,
            message: 'Successfully got all book genres',
            data: {
                pagination: Object.assign({}, getBookGenresPaginationMetadata),
                results: getBookGenresStatus.rows
            }
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while getting all book genres');
        return {
            success: false,
            message: 'Failed to get all book genres'
        };
    }
});
exports.GetBookGenres = GetBookGenres;
// service to add new book genre
const AddBookGenre = (genreName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // verify if book genre already exists or not
        const foundBookGenre = yield db_configs_1.db.query('SELECT COUNT(*) FROM genres WHERE genres.genre_name = $1', [genreName]);
        if (foundBookGenre.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to add book genre'
            };
        }
        if (foundBookGenre.rows[0].count > 0) {
            return {
                success: false,
                message: 'Book genre is already available'
            };
        }
        // add genre
        const addBookGenreStatus = yield db_configs_1.db.query('INSERT INTO genres (genre_name) VALUES ($1) RETURNING *', [genreName]);
        if (addBookGenreStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to add book genre'
            };
        }
        return {
            success: true,
            message: 'Successfully added book genre',
            data: addBookGenreStatus.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while adding new book genre');
        return {
            success: false,
            message: 'Failed to add book genre'
        };
    }
});
exports.AddBookGenre = AddBookGenre;
// service to update book genre
const UpdateGenre = (genreId, genreName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // verify if book genre already exists or not
        const foundBookGenre = yield db_configs_1.db.query('SELECT COUNT(*) FROM genres WHERE genres.genre_id = $1', [genreId]);
        if (foundBookGenre.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to update book genre'
            };
        }
        if (foundBookGenre.rows[0].count === 0) {
            return {
                success: false,
                message: 'Book genre is not available'
            };
        }
        // update genre
        const updateBookGenreStatus = yield db_configs_1.db.query('UPDATE genres SET genre_name = $1 WHERE genre_id = $2 RETURNING *', [
            genreName,
            genreId
        ]);
        if (updateBookGenreStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to updated book genre'
            };
        }
        return {
            success: true,
            message: 'Successfully updated book genre',
            data: updateBookGenreStatus.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while updating book genre');
        return {
            success: false,
            message: 'Failed to update book genre'
        };
    }
});
exports.UpdateGenre = UpdateGenre;
// service to delete book genre
const DeleteGenre = (genreId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // verify if book genre already exists or not
        const foundBookGenre = yield db_configs_1.db.query('SELECT COUNT(*) FROM genres WHERE genres.genre_id = $1', [genreId]);
        if (foundBookGenre.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to remove book genre'
            };
        }
        if (foundBookGenre.rows[0].count === 0) {
            return {
                success: false,
                message: 'Book genre is not available'
            };
        }
        // delete genre
        const updateBookGenreStatus = yield db_configs_1.db.query('DELETE FROM genres WHERE genre_id = $1 RETURNING *', [genreId]);
        if (updateBookGenreStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to remove book genre'
            };
        }
        return {
            success: true,
            message: 'Successfully removed book genre',
            data: updateBookGenreStatus.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while removing book genre');
        return {
            success: false,
            message: 'Failed to remove book genre'
        };
    }
});
exports.DeleteGenre = DeleteGenre;
