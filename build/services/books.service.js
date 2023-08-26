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
exports.DeleteBookImage = exports.UpdateBookImg = exports.AddBookImg = exports.RemoveBookWithId = exports.UpdateBookGenre = exports.UpdateBookAuthor = exports.UpdateBook = exports.AddBook = exports.GetOnlyOneBook = exports.GetAllBooks = void 0;
/* eslint-disable no-console */
/* eslint-disable quotes */
const db_configs_1 = require("../configs/db.configs");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
const generatePaginationMetadata_1 = __importDefault(require("../helpers/generatePaginationMetadata"));
// service for getting all books
const GetAllBooks = (genre, author, page, size) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get all book status
        let getBooksStatus;
        // count all books for pagination data
        const countGetAllBooks = yield db_configs_1.db.query(`SELECT COUNT(*) FROM books
        LEFT JOIN genres ON books.genre_id = genres.genre_id
        LEFT JOIN authors ON books.authorid = authors.authorid
         WHERE (genres.genre_name = $1 OR $1 IS NULL)
         AND (CONCAT(authors.firstname, ' ', authors.lastname) = $2 OR $2 IS NULL)`, [genre, author]);
        if (countGetAllBooks.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to get all books'
            };
        }
        // pagination required
        if (page != null && page !== undefined && size != null && size !== undefined) {
            // get books with page and size
            getBooksStatus = yield db_configs_1.db.query(`SELECT books.*,genres.*,authors.authorid, authors.firstname AS author_firstname, authors.lastname AS author_lastname, front_book_image.img_src AS front_img_src, back_book_image AS back_img_src FROM books
          LEFT JOIN genres ON books.genre_id = genres.genre_id
          LEFT JOIN authors ON books.authorid = authors.authorid
          LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
          LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
            WHERE genres.genre_name = $1 OR $1 IS NULL 
            AND CONCAT(authors.firstname, ' ', authors.lastname) = $2 OR $2 IS NULL
              LIMIT $3 OFFSET ($4 - 1) * $3`, [genre, author, size, page]);
        }
        else {
            // get books without page and size
            getBooksStatus = yield db_configs_1.db.query(`SELECT books.*,genres.*,authors.authorid, authors.firstname AS author_firstname, authors.lastname AS author_lastname, front_book_image.img_src AS front_img_src, back_book_image AS back_img_src FROM books
          LEFT JOIN genres ON books.genre_id = genres.genre_id
          LEFT JOIN authors ON books.authorid = authors.authorid
          LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
          LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
            WHERE (genres.genre_name = $1 OR $1 IS NULL)
            AND (CONCAT(authors.firstname, ' ', authors.lastname) = $2 OR $2 IS NULL)`, [genre, author]);
        }
        if (getBooksStatus.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to get all books'
            };
        }
        // paginatioon metdadata for get all books
        const getBooksPaginationMetadata = (0, generatePaginationMetadata_1.default)(countGetAllBooks.rows[0].count, page !== null && page !== void 0 ? page : 1, size !== null && size !== void 0 ? size : countGetAllBooks.rows[0].count);
        return {
            success: true,
            message: 'Successfully got all books',
            data: {
                pagination: Object.assign({}, getBooksPaginationMetadata),
                results: getBooksStatus.rows
            }
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while getting all books');
        return {
            success: false,
            message: 'Failed to get all books'
        };
    }
});
exports.GetAllBooks = GetAllBooks;
// service for getting all books
const GetOnlyOneBook = (bookID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getBooksStatus = yield db_configs_1.db.query(`SELECT books.*,genres.*,authors.authorid, authors.firstname AS author_firstname, authors.lastname AS author_lastname, front_book_image.img_src AS front_img_src, back_book_image AS back_img_src FROM books
       LEFT JOIN genres ON books.genre_id = genres.genre_id
       LEFT JOIN authors ON books.authorid = authors.authorid
       LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
       LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
       WHERE books.bookid = $1`, [bookID]);
        if (getBooksStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Book is not available'
            };
        }
        return {
            success: true,
            message: 'Successfully got a book',
            data: getBooksStatus.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while getting a book');
        return {
            success: false,
            message: 'Error while getting a book'
        };
    }
});
exports.GetOnlyOneBook = GetOnlyOneBook;
// service for adding new books
const AddBook = (bookData, authorFirstname, authorLastname) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // first getting author and coparing if authors exits then not adding or else adding
        const getAuthorStatus = yield db_configs_1.db.query('SELECT authorid FROM authors WHERE firstname = $1 AND lastname = $2', [
            authorFirstname,
            authorLastname
        ]);
        // authorid of new or found author
        let currentAuthorid;
        if (getAuthorStatus.rowCount <= 0) {
            // no author found so add new author
            const addAuthorStatus = yield db_configs_1.db.query('INSERT INTO authors (firstname, lastname) VALUES ($1, $2) RETURNING authorid', [authorFirstname, authorLastname]);
            if (addAuthorStatus.rowCount <= 0) {
                return {
                    success: false,
                    message: 'Failed while adding Book'
                };
            }
            currentAuthorid = addAuthorStatus.rows[0].authorid;
        }
        else {
            // autor found so get the authorid
            currentAuthorid = getAuthorStatus.rows[0].authorid;
        }
        // now add book genres if available or not
        const getBookGenresStatus = yield db_configs_1.db.query(`SELECT genre_id FROM genres WHERE genres.genre_name = $1`, [
            bookData.genre
        ]);
        let currentGenreId;
        // genre exits
        if (getBookGenresStatus.rowCount > 0) {
            currentGenreId = getBookGenresStatus.rows[0].genre_id;
        }
        else {
            // genre doesn't exist so add new genre
            const addBookNewGenre = yield db_configs_1.db.query(`INSERT INTO genres (genre_name) VALUES ($1) RETURNING genre_id`, [
                bookData.genre
            ]);
            currentGenreId = addBookNewGenre.rows[0].genre_id;
        }
        // now add new book with authorid and payload
        const addBookStatus = yield db_configs_1.db.query('INSERT INTO books (authorid, title, price, publication_date, book_type, book_condition, available_quantity, isbn, description, genre_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *', [
            currentAuthorid,
            bookData.title,
            bookData.price,
            bookData.publication_date,
            bookData.book_type,
            bookData.book_condition,
            bookData.available_quantity,
            bookData.isbn,
            bookData.description,
            currentGenreId
        ]);
        if (addBookStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed while adding new book'
            };
        }
        return {
            success: true,
            message: 'Successfully added new book',
            data: addBookStatus.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while adding new book');
        return {
            success: false,
            message: 'Failed while adding new book'
        };
    }
});
exports.AddBook = AddBook;
// service for updating new books
const UpdateBook = (bookID, newBookInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // first get the book from db
        const bookWithId = yield db_configs_1.db.query('SELECT * FROM books WHERE books.bookid = $1', [bookID]);
        if (bookWithId.rowCount <= 0) {
            return {
                success: false,
                message: 'Book is unavailable'
            };
        }
        const oldBookInfo = bookWithId.rows[0];
        // new updated book payload for using in updating book
        const toUpdateBookInfo = Object.assign(oldBookInfo, newBookInfo);
        // update book by db
        const bookUpdateStatus = yield db_configs_1.db.query('UPDATE books SET title = $1, price = $2, publication_date = $3, book_type = $4, book_condition = $5, available_quantity = $6, isbn = $7, description = $8  WHERE books.bookid = $9 RETURNING *', [
            toUpdateBookInfo.title,
            toUpdateBookInfo.price,
            toUpdateBookInfo.publication_date,
            toUpdateBookInfo.book_type,
            toUpdateBookInfo.book_condition,
            toUpdateBookInfo.available_quantity,
            toUpdateBookInfo.isbn,
            toUpdateBookInfo.description,
            toUpdateBookInfo.bookid
        ]);
        if (bookUpdateStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to update book'
            };
        }
        return {
            success: true,
            message: 'Successfully updated book',
            data: bookUpdateStatus.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while updating book');
        return {
            success: false,
            message: 'Failed to update book'
        };
    }
});
exports.UpdateBook = UpdateBook;
// service for updating book genre
const UpdateBookAuthor = (firstname, lastname, bookid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // new genre_id
        let newAuthorid;
        // verify if Genre exists or not
        const foundBookAuthor = yield db_configs_1.db.query('SELECT * FROM authors WHERE authors.firstname = $1 AND authors.lastname = $2', [firstname, lastname]);
        // error while db query
        if (foundBookAuthor.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to update book author'
            };
        }
        else if (foundBookAuthor.rowCount === 0) {
            // book genre not avaiable
            // create new book genre
            const createNewBookAuthorStatus = yield db_configs_1.db.query('INSERT INTO authors (firstname, lastname) VALUES ($1, $2) RETURNING *', [firstname, lastname]);
            newAuthorid = createNewBookAuthorStatus.rows[0].authorid;
        }
        else {
            // book genre available
            newAuthorid = foundBookAuthor.rows[0].authorid;
        }
        // update book with new genre_id
        const updateBookAuthor = yield db_configs_1.db.query('UPDATE books SET authorid = $1 WHERE bookid = $2 RETURNING *', [
            newAuthorid,
            bookid
        ]);
        if (updateBookAuthor.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to update book genre'
            };
        }
        return {
            success: true,
            message: 'Successfully Update Book Author',
            data: updateBookAuthor.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while updating book author');
        return {
            success: false,
            message: 'Error while updating book author'
        };
    }
});
exports.UpdateBookAuthor = UpdateBookAuthor;
// service for updating book genre
const UpdateBookGenre = (genre, bookid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // new genre_id
        let newGenreId;
        // verify if Genre exists or not
        const foundBookGenre = yield db_configs_1.db.query('SELECT * FROM genres WHERE genres.genre_name = $1', [genre]);
        // error while db query
        if (foundBookGenre.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to update book genre'
            };
        }
        else if (foundBookGenre.rowCount === 0) {
            // book genre not avaiable
            // create new book genre
            const createNewBookGenreStatus = yield db_configs_1.db.query('INSERT INTO genres (genre_name) VALUES ($1) RETURNING *', [
                genre
            ]);
            newGenreId = createNewBookGenreStatus.rows[0].genre_id;
        }
        else {
            // book genre available
            newGenreId = foundBookGenre.rows[0].genre_id;
        }
        // update book with new genre_id
        const updateBookGenre = yield db_configs_1.db.query('UPDATE books SET genre_id = $1 WHERE bookid = $2 RETURNING *', [
            newGenreId,
            bookid
        ]);
        if (updateBookGenre.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to update book genre'
            };
        }
        return {
            success: true,
            message: 'Successfully Update Boook Genre',
            data: updateBookGenre.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while updating book genre');
        return {
            success: false,
            message: 'Error while updating book genre'
        };
    }
});
exports.UpdateBookGenre = UpdateBookGenre;
// service for removing a book
const RemoveBookWithId = (bookID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the book with bookid
        const bookWithId = yield db_configs_1.db.query('SELECT bookid FROM books WHERE bookid = $1', [bookID]);
        // book not found with given bookid
        if (bookWithId.rowCount <= 0) {
            return {
                success: false,
                message: 'Book is not available'
            };
        }
        // get the book images
        const bookImagesWithId = yield db_configs_1.db.query('SELECT img_public_id FROM book_images WHERE bookid = $1', [bookID]);
        let deleteBookImagesWithIdStatus;
        // if only book images exits delete them
        if (bookImagesWithId.rowCount === 2) {
            // and delete book images from cloud
            const removeImgFromCloudStatus1 = yield (0, cloudinary_utils_1.removeImageFromCloud)(bookImagesWithId.rows[0].img_public_id);
            const removeImgFromCloudStatus2 = yield (0, cloudinary_utils_1.removeImageFromCloud)(bookImagesWithId.rows[1].img_public_id);
            if (!removeImgFromCloudStatus1.success || !removeImgFromCloudStatus2.success) {
                return {
                    success: false,
                    message: 'Failed to remove book'
                };
            }
            // then delete book images with bookid from db
            deleteBookImagesWithIdStatus = yield db_configs_1.db.query('DELETE FROM book_images WHERE bookid = $1 RETURNING book_image_id', [bookID]);
            if (deleteBookImagesWithIdStatus.rowCount <= 0) {
                return {
                    success: false,
                    message: 'Failed to remove book'
                };
            }
        }
        if (bookImagesWithId.rowCount === 1) {
            // and delete book images from cloud
            const removeImgFromCloudStatus1 = yield (0, cloudinary_utils_1.removeImageFromCloud)(bookImagesWithId.rows[0].img_public_id);
            if (!removeImgFromCloudStatus1.success) {
                return {
                    success: false,
                    message: 'Failed to remove book'
                };
            }
            // then delete book images with bookid from db
            deleteBookImagesWithIdStatus = yield db_configs_1.db.query('DELETE FROM book_images WHERE bookid = $1 RETURNING book_image_id', [bookID]);
            if (deleteBookImagesWithIdStatus.rowCount <= 0) {
                return {
                    success: false,
                    message: 'Failed to remove book'
                };
            }
        }
        // delete book's reviews
        const foundBookReviews = yield db_configs_1.db.query('SELECT reviewid FROM reviews WHERE reviews.bookid = $1', [bookID]);
        if (foundBookReviews.rowCount > 0) {
            // if reviews found delete them
            const deleteBookReviews = yield db_configs_1.db.query('DELETE FROM reviews WHERE reviews.bookid = $1 RETURNING reviewid', [
                bookID
            ]);
            if (deleteBookReviews.rowCount <= 0) {
                return {
                    success: false,
                    message: 'Failed to remove book'
                };
            }
        }
        // delete carts with this books
        const foundCarts = yield db_configs_1.db.query('SELECT cartid FROM carts WHERE carts.bookid = $1', [bookID]);
        if (foundCarts.rowCount > 0) {
            // if carts found delete them
            const deleteCarts = yield db_configs_1.db.query('DELETE FROM carts WHERE carts.bookid = $1 RETURNING cartid', [bookID]);
            if (deleteCarts.rowCount <= 0) {
                return {
                    success: false,
                    message: 'Failed to remove book'
                };
            }
        }
        // now delete book with bookid
        const deleteBookWithIdStatus = yield db_configs_1.db.query('DELETE FROM books WHERE books.bookid = $1 RETURNING *', [bookID]);
        if (deleteBookWithIdStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to remove book'
            };
        }
        return {
            success: true,
            message: 'Successfully removed book',
            data: deleteBookWithIdStatus.rows[0]
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while removing a book');
        return {
            success: false,
            message: 'Failed to remove book'
        };
    }
});
exports.RemoveBookWithId = RemoveBookWithId;
// service to add book image
const AddBookImg = (bookid, imgPath, imgType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // first showing if book is in db or not
        const isBookFound = yield db_configs_1.db.query('SELECT bookid FROM books WHERE bookid = $1', [bookid]);
        if (isBookFound.rowCount <= 0) {
            return {
                success: false,
                message: 'Book is not available'
            };
        }
        // check if already book image exitst or not
        const isBookImgFound = yield db_configs_1.db.query('SELECT book_image_id FROM book_images WHERE bookid = $1 AND img_type = $2', [
            bookid,
            imgType
        ]);
        if (isBookImgFound.rowCount > 0) {
            return {
                success: false,
                message: `Book Image of ${imgType} cover already exists`
            };
        }
        // call util cloudingary upload function
        const imgUploadStatus = yield (0, cloudinary_utils_1.uploadImageToCloud)(imgPath);
        if (!imgUploadStatus.success) {
            return {
                success: false,
                message: 'Failed to upload book image'
            };
        }
        const imgToDbStatus = yield db_configs_1.db.query('INSERT INTO book_images(bookid, img_src, img_type, img_public_id) VALUES ($1, $2, $3, $4) RETURNING img_src', [bookid, imgUploadStatus.imgURL, imgType, imgUploadStatus.imgPublicId]);
        if (imgToDbStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to upload book image'
            };
        }
        return {
            success: true,
            message: 'Successfully uploaded book image',
            data: {
                src: imgToDbStatus.rows[0].img_src
            }
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while uploading book image');
        return {
            success: false,
            message: 'Failed to upload book image'
        };
    }
});
exports.AddBookImg = AddBookImg;
// service to upadte book images
const UpdateBookImg = (bookid, imgPath, imgType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // first find if book exits or not
        const isBookFound = yield db_configs_1.db.query('SELECT bookid FROM books WHERE bookid = $1', [bookid]);
        if (isBookFound.rowCount <= 0) {
            return {
                success: false,
                message: 'Book is unavailable'
            };
        }
        // then find if book image exits or not
        const isBookImgFound = yield db_configs_1.db.query('SELECT img_public_id FROM book_images WHERE bookid = $1 AND img_type = $2', [
            bookid,
            imgType
        ]);
        if (isBookImgFound.rowCount <= 0) {
            return {
                success: false,
                message: 'Book images is unavailable'
            };
        }
        // get the public_id of book images
        const imgPublicId = yield isBookImgFound.rows[0].img_public_id;
        // call util cloudingary update function
        const imgUpdateStatus = yield (0, cloudinary_utils_1.updateImageToCloud)(imgPath, imgPublicId);
        if (!imgUpdateStatus.success) {
            return {
                success: false,
                message: 'Failed to update book image'
            };
        }
        return {
            success: true,
            message: 'Successfully updated book images'
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while updating book images');
        return {
            success: false,
            message: 'Failed to update book images'
        };
    }
});
exports.UpdateBookImg = UpdateBookImg;
// service to delete book image
const DeleteBookImage = (bookid, imgType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // first show if book images
        const isBookImgFound = yield db_configs_1.db.query('SELECT img_public_id FROM book_images WHERE bookid = $1 AND img_type = $2', [
            bookid,
            imgType
        ]);
        if (isBookImgFound.rowCount <= 0) {
            return {
                success: false,
                message: 'Book images is unavailable'
            };
        }
        // call util remove image from cloud
        const removeImgFromCloudStatus = yield (0, cloudinary_utils_1.removeImageFromCloud)(isBookImgFound.rows[0].img_public_id);
        if (!removeImgFromCloudStatus.success) {
            return {
                success: false,
                message: 'Failed to remove book image'
            };
        }
        // remove images from db
        const bookImgRemoveStatus = yield db_configs_1.db.query('DELETE FROM book_images WHERE bookid = $1 AND img_type = $2 RETURNING book_image_id', [bookid, imgType]);
        if (bookImgRemoveStatus.rowCount <= 0) {
            return {
                success: false,
                message: 'Failed to remove book image'
            };
        }
        return {
            success: true,
            message: 'Successfully removed book image'
        };
    }
    catch (err) {
        logger_utils_1.default.error(err, 'Error while removing book image');
        return {
            success: false,
            message: 'Failed to remove book image'
        };
    }
});
exports.DeleteBookImage = DeleteBookImage;
