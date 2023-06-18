'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.DeleteBookImage =
  exports.UpdateBookImg =
  exports.AddBookImg =
  exports.RemoveBookWithId =
  exports.UpdateBook =
  exports.AddBook =
  exports.GetOnlyOneBook =
  exports.GetAllBooks =
    void 0
const db_configs_1 = require('../configs/db.configs')
const cloudinary_utils_1 = require('../utils/cloudinary.utils')
// service for getting all books
const GetAllBooks = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const getBooksStatus = yield db_configs_1.db.query(`SELECT * FROM books`)
      if (getBooksStatus.rowCount <= 0) {
        return {
          success: true,
          message: 'No Books found',
          data: []
        }
      }
      return {
        success: true,
        message: 'Successfully got all books',
        data: getBooksStatus.rows
      }
    } catch (err) {
      console.log(err)
      console.log('Error while getting all books')
      return {
        success: false,
        message: 'Error while getting all books'
      }
    }
  })
exports.GetAllBooks = GetAllBooks
// service for getting all books
const GetOnlyOneBook = bookID =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const getBooksStatus = yield db_configs_1.db.query(`SELECT * FROM books WHERE books.bookid = $1`, [bookID])
      if (getBooksStatus.rowCount <= 0) {
        return {
          success: false,
          message: 'No book with id: ' + String(bookID) + ' found'
        }
      }
      return {
        success: true,
        message: 'Successfully got a book by id: ' + String(bookID),
        data: getBooksStatus.rows[0]
      }
    } catch (err) {
      console.log(err)
      console.log('Error while getting one book by id: ' + String(bookID))
      return {
        success: false,
        message: 'Error while getting one book by id: ' + String(bookID)
      }
    }
  })
exports.GetOnlyOneBook = GetOnlyOneBook
// service for adding new books
const AddBook = (bookData, authorFirstname, authorLastname) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // first getting author and coparing if authors exits then not adding or else adding
      const getAuthorStatus = yield db_configs_1.db.query(
        `SELECT * FROM authors WHERE firstname = $1 AND lastname = $2`,
        [authorFirstname, authorLastname]
      )
      // authorid of new or found author
      let currentAuthorid
      if (getAuthorStatus.rowCount <= 0) {
        // no author found so add new author
        const addAuthorStatus = yield db_configs_1.db.query(
          `INSERT INTO authors (firstname, lastname) VALUES ($1, $2) RETURNING *`,
          [authorFirstname, authorLastname]
        )
        if (addAuthorStatus.rowCount <= 0) {
          return {
            success: false,
            message: 'Error while adding Books author'
          }
        }
        currentAuthorid = addAuthorStatus.rows[0].authorid
      } else {
        // autor found so get the authorid
        currentAuthorid = getAuthorStatus.rows[0].authorid
      }
      // now add new book with authorid and payload
      const addBookStatus = yield db_configs_1.db.query(
        `INSERT INTO books (authorid, title, price, publication_date, book_type, book_condition, available_quantity, isbn, description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [
          currentAuthorid,
          bookData.title,
          bookData.price,
          bookData.publication_date,
          bookData.book_type,
          bookData.book_condition,
          bookData.available_quantity,
          bookData.isbn,
          bookData.description
        ]
      )
      if (addBookStatus.rowCount <= 0) {
        return {
          success: false,
          message: 'Error while adding new book'
        }
      }
      return {
        success: true,
        message: 'Successfully added new book: ' + bookData.title,
        data: addBookStatus.rows[0]
      }
    } catch (err) {
      console.log(err)
      console.log('Error while adding new book')
      return {
        success: false,
        message: 'Error while adding new book'
      }
    }
  })
exports.AddBook = AddBook
// service for updating new books
const UpdateBook = (bookID, newBookInfo) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // first get the book from db
      const bookWithId = yield db_configs_1.db.query(`SELECT * FROM books WHERE books.bookid = $1`, [bookID])
      if (bookWithId.rowCount <= 0) {
        return {
          success: false,
          message: 'No Book with id ' + String(bookID) + ' found'
        }
      }
      const oldBookInfo = bookWithId.rows[0]
      // new updated book payload for using in updating book
      const toUpdateBookInfo = Object.assign(oldBookInfo, newBookInfo)
      // update book by db
      const bookUpdateStatus = yield db_configs_1.db.query(
        `UPDATE books SET title = $1, price = $2, publication_date = $3, book_type = $4, book_condition = $5, available_quantity = $6, isbn = $7, description = $8  WHERE books.bookid = $9 RETURNING *`,
        [
          toUpdateBookInfo.title,
          toUpdateBookInfo.price,
          toUpdateBookInfo.publication_date,
          toUpdateBookInfo.book_type,
          toUpdateBookInfo.book_condition,
          toUpdateBookInfo.available_quantity,
          toUpdateBookInfo.isbn,
          toUpdateBookInfo.description,
          toUpdateBookInfo.bookid
        ]
      )
      if (bookUpdateStatus.rowCount <= 0) {
        return {
          success: false,
          message: 'Error while updating book with id ' + String(bookID)
        }
      }
      return {
        success: true,
        message: 'Successfully updated book with id ' + String(bookID),
        data: bookUpdateStatus.rows[0]
      }
    } catch (err) {
      console.log(err)
      console.log('Error while updating book with id: ' + String(bookID))
      return {
        success: false,
        message: 'Error while updating book with id: ' + String(bookID)
      }
    }
  })
exports.UpdateBook = UpdateBook
// service for removing a book
const RemoveBookWithId = bookID =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // get the book with bookid
      const bookWithId = yield db_configs_1.db.query(`SELECT * FROM books WHERE bookid = $1`, [bookID])
      // book not found with given bookid
      if (bookWithId.rowCount <= 0) {
        return {
          success: false,
          message: 'No Book with ID ' + String(bookID) + ' found'
        }
      }
      // get the book images
      const bookImagesWithId = yield db_configs_1.db.query(`SELECT * FROM book_images WHERE bookid = $1`, [bookID])
      let deleteBookImagesWithIdStatus
      // if only book images exits delete them
      if (bookImagesWithId.rowCount === 2) {
        // and delete book images from cloud
        yield (0, cloudinary_utils_1.removeImageFromCloud)(bookImagesWithId.rows[0].img_public_id)
        yield (0, cloudinary_utils_1.removeImageFromCloud)(bookImagesWithId.rows[1].img_public_id)
        // then delete book images with bookid from db
        deleteBookImagesWithIdStatus = yield db_configs_1.db.query(
          `DELETE FROM book_images WHERE bookid = $1 RETURNING *`,
          [bookID]
        )
        if (deleteBookImagesWithIdStatus.rowCount <= 0) {
          return {
            success: false,
            message: 'Error while deleting book images with id: ' + String(bookID)
          }
        }
      }
      if (bookImagesWithId.rowCount === 1) {
        // and delete book images from cloud
        yield (0, cloudinary_utils_1.removeImageFromCloud)(bookImagesWithId.rows[0].img_public_id)
        // then delete book images with bookid from db
        deleteBookImagesWithIdStatus = yield db_configs_1.db.query(
          `DELETE FROM book_images WHERE bookid = $1 RETURNING *`,
          [bookID]
        )
        if (deleteBookImagesWithIdStatus.rowCount <= 0) {
          return {
            success: false,
            message: 'Error while deleting book images with id: ' + String(bookID)
          }
        }
      }
      // delete book's reviews
      const foundBookReviews = yield db_configs_1.db.query(`SELECT * FROM reviews WHERE reviews.bookid = $1`, [bookID])
      if (foundBookReviews.rowCount > 0) {
        // if reviews found delete them
        const deleteBookReviews = yield db_configs_1.db.query(
          `DELETE FROM reviews WHERE reviews.bookid = $1 RETURNING *`,
          [bookID]
        )
        if (deleteBookReviews.rowCount <= 0) {
          return {
            success: false,
            message: 'Failed to delete book reviews'
          }
        }
      }
      // delete carts with this booki
      const foundCarts = yield db_configs_1.db.query(`SELECT * FROM carts WHERE carts.bookid = $1`, [bookID])
      if (foundCarts.rowCount > 0) {
        // if carts found delete them
        const deleteCarts = yield db_configs_1.db.query(`DELETE FROM carts WHERE carts.bookid = $1 RETURNING *`, [
          bookID
        ])
        if (deleteCarts.rowCount <= 0) {
          return {
            success: false,
            message: 'Failed to delete carts'
          }
        }
      }
      // now delete book with bookid
      const deleteBookWithIdStatus = yield db_configs_1.db.query(
        `DELETE FROM books WHERE books.bookid = $1 RETURNING *`,
        [bookID]
      )
      if (deleteBookWithIdStatus.rowCount <= 0) {
        return {
          success: false,
          message: 'Error while Deleting book with id ' + String(bookID)
        }
      }
      return {
        success: true,
        message: 'Successfully Removed book witth id ' + String(bookID),
        data: deleteBookWithIdStatus.rows[0]
      }
    } catch (err) {
      console.log(err)
      console.log('Error while removing a book with id ' + String(bookID))
      return {
        success: false,
        message: 'Error while removing a book with id ' + String(bookID)
      }
    }
  })
exports.RemoveBookWithId = RemoveBookWithId
// service to add book image
const AddBookImg = (bookid, imgPath, imgType) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // first showing if book is in db or not
      const isBookFound = yield db_configs_1.db.query(`SELECT * FROM books WHERE bookid = $1`, [bookid])
      if (isBookFound.rowCount <= 0) {
        return {
          success: false,
          message: 'Book Not Found'
        }
      }
      // check if already book image exitst or not
      const isBookImgFound = yield db_configs_1.db.query(
        `SELECT * FROM book_images WHERE bookid = $1 AND img_type = $2`,
        [bookid, imgType]
      )
      if (isBookImgFound.rowCount > 0) {
        return {
          success: false,
          message: 'Book Image of ' + imgType + ' cover already exits'
        }
      }
      // call util cloudingary upload function
      const imgUploadStatus = yield (0, cloudinary_utils_1.uploadImageToCloud)(imgPath)
      if (!imgUploadStatus.success) {
        return {
          success: false,
          message: 'Failed to upload book image'
        }
      }
      const imgToDbStatus = yield db_configs_1.db.query(
        `INSERT INTO book_images(bookid, img_src, img_type, img_public_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        [bookid, imgUploadStatus.imgURL, imgType, imgUploadStatus.imgPublicId]
      )
      if (imgToDbStatus.rowCount <= 0) {
        return {
          success: false,
          message: 'Failed to upload book image'
        }
      }
      return {
        success: true,
        message: imgUploadStatus.message,
        data: {
          src: imgToDbStatus.rows[0].img_src
        }
      }
    } catch (err) {
      console.log(err)
      return {
        success: false,
        message: 'Failed to upload book image'
      }
    }
  })
exports.AddBookImg = AddBookImg
// service to upadte book images
const UpdateBookImg = (bookid, imgPath, imgType) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // first find if book exits or not
      const isBookFound = yield db_configs_1.db.query(`SELECT * FROM books WHERE bookid = $1`, [bookid])
      if (isBookFound.rowCount <= 0) {
        return {
          success: false,
          message: 'No book found'
        }
      }
      // then find if book image exits or not
      const isBookImgFound = yield db_configs_1.db.query(
        `SELECT * FROM book_images WHERE bookid = $1 AND img_type = $2`,
        [bookid, imgType]
      )
      if (isBookImgFound.rowCount <= 0) {
        return {
          success: false,
          message: 'Book images not found ! Upload them first'
        }
      }
      // get the public_id of book images
      const imgPublicId = yield isBookImgFound.rows[0].img_public_id
      // call util cloudingary update function
      const imgUpdateStatus = yield (0, cloudinary_utils_1.updateImageToCloud)(imgPath, imgPublicId)
      if (!imgUpdateStatus.success) {
        return Object.assign({}, imgUpdateStatus)
      }
      return {
        success: true,
        message: `Successfully updated book images of bookid: ${bookid} of ${imgType}-COVER`
      }
    } catch (err) {
      console.log(err)
      return {
        success: false,
        message: 'Failed to update book images'
      }
    }
  })
exports.UpdateBookImg = UpdateBookImg
// service to delete book image
const DeleteBookImage = (bookid, imgType) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // first show if book images
      const isBookImgFound = yield db_configs_1.db.query(
        `SELECT * FROM book_images WHERE bookid = $1 AND img_type = $2`,
        [bookid, imgType]
      )
      if (isBookImgFound.rowCount <= 0) {
        return {
          success: false,
          message: 'No Book images found'
        }
      }
      // call util remove image from cloud
      const removeImgFromCloudStatus = yield (0, cloudinary_utils_1.removeImageFromCloud)(
        isBookImgFound.rows[0].img_public_id
      )
      console.log(removeImgFromCloudStatus)
      if (!removeImgFromCloudStatus.success) {
        return {
          success: false,
          message: 'Failed to remove image from cloud'
        }
      }
      // remove images from db
      const bookImgRemoveStatus = yield db_configs_1.db.query(
        `DELETE FROM book_images WHERE bookid = $1 AND img_type = $2`,
        [bookid, imgType]
      )
      if (bookImgRemoveStatus.rowCount <= 0) {
        return {
          success: false,
          message: 'Failed to remove book image'
        }
      }
      return {
        success: true,
        message: 'Successfully deleted'
      }
    } catch (err) {
      console.log(err)
      return {
        success: false,
        message: 'Failed to remove book images'
      }
    }
  })
exports.DeleteBookImage = DeleteBookImage
