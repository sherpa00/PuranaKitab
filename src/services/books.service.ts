/* eslint-disable no-console */
/* eslint-disable quotes */
import { db } from '../configs/db.configs'
import {
  uploadImageToCloud,
  type ICloudinaryResponse,
  updateImageToCloud,
  removeImageFromCloud
} from '../utils/cloudinary.utils'
import type { ServiceResponse, IBook, IPaginationMetadata } from '../types'
import logger from '../utils/logger.utils'
import generatePaginationMetadata from '../helpers/generatePaginationMetadata'

export type NewBookPayload = Omit<IBook, 'createdat' | 'bookid' | 'authorid' | 'genre_id'>

// service for getting all books
const GetAllBooks = async (
  genre?: string | null ,
  author?: string | null ,
  page?: number,
  size?: number
): Promise<ServiceResponse> => {
  try {
    // get all book status
    let getBooksStatus: any

    // count all books for pagination data
    const countGetAllBooks = await db.query(
      `SELECT COUNT(*) FROM books
        LEFT JOIN genres ON books.genre_id = genres.genre_id
        LEFT JOIN authors ON books.authorid = authors.authorid
         WHERE (genres.genre_name = $1 OR $1 IS NULL)
         AND (CONCAT(authors.firstname, ' ', authors.lastname) = $2 OR $2 IS NULL)`,
      [genre, author]
    )

    if (countGetAllBooks.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to get all books'
      }
    }

    // pagination required
    if (page != null && page !== undefined && size != null && size !== undefined) {
      // get books with page and size
      getBooksStatus = await db.query(
        `SELECT books.*,genres.*,authors.authorid, authors.firstname AS author_firstname, authors.lastname AS author_lastname, front_book_image.img_src AS front_img_src, back_book_image AS back_img_src FROM books
          LEFT JOIN genres ON books.genre_id = genres.genre_id
          LEFT JOIN authors ON books.authorid = authors.authorid
          LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
          LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
            WHERE genres.genre_name = $1 OR $1 IS NULL 
            AND CONCAT(authors.firstname, ' ', authors.lastname) = $2 OR $2 IS NULL
              LIMIT $3 OFFSET ($4 - 1) * $3`,
        [genre, author, size, page]
      )
    } else {
      // get books without page and size
      getBooksStatus = await db.query(
        `SELECT books.*,genres.*,authors.authorid, authors.firstname AS author_firstname, authors.lastname AS author_lastname, front_book_image.img_src AS front_img_src, back_book_image AS back_img_src FROM books
          LEFT JOIN genres ON books.genre_id = genres.genre_id
          LEFT JOIN authors ON books.authorid = authors.authorid
          LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
          LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
            WHERE (genres.genre_name = $1 OR $1 IS NULL)
            AND (CONCAT(authors.firstname, ' ', authors.lastname) = $2 OR $2 IS NULL)`,
        [genre, author]
      )
    }

    if (getBooksStatus.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to get all books'
      }
    }

    // paginatioon metdadata for get all books
    const getBooksPaginationMetadata: IPaginationMetadata = generatePaginationMetadata(
      countGetAllBooks.rows[0].count,
      page ?? 1,
      size ?? countGetAllBooks.rows[0].count
    )

    return {
      success: true,
      message: 'Successfully got all books',
      data: {
        pagination: {
          ...getBooksPaginationMetadata
        },
        results: getBooksStatus.rows
      }
    }
  } catch (err) {
    logger.error(err, 'Error while getting all books')
    return {
      success: false,
      message: 'Failed to get all books'
    }
  }
}

// service for getting all books
const GetOnlyOneBook = async (bookID: number): Promise<ServiceResponse> => {
  try {
    const getBooksStatus = await db.query(
      `SELECT books.*,genres.*,authors.authorid, authors.firstname AS author_firstname, authors.lastname AS author_lastname, front_book_image.img_src AS front_img_src, back_book_image AS back_img_src FROM books
       LEFT JOIN genres ON books.genre_id = genres.genre_id
       LEFT JOIN authors ON books.authorid = authors.authorid
       LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
       LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
       WHERE books.bookid = $1`,
      [bookID]
    )

    if (getBooksStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Book is not available'
      }
    }

    return {
      success: true,
      message: 'Successfully got a book',
      data: getBooksStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while getting a book')
    return {
      success: false,
      message: 'Error while getting a book'
    }
  }
}

// service for adding new books
const AddBook = async (
  bookData: NewBookPayload,
  authorFirstname: string,
  authorLastname: string
): Promise<ServiceResponse> => {
  try {
    // first getting author and coparing if authors exits then not adding or else adding
    const getAuthorStatus = await db.query('SELECT authorid FROM authors WHERE firstname = $1 AND lastname = $2', [
      authorFirstname,
      authorLastname
    ])

    // authorid of new or found author
    let currentAuthorid: number

    if (getAuthorStatus.rowCount <= 0) {
      // no author found so add new author
      const addAuthorStatus = await db.query('INSERT INTO authors (firstname, lastname) VALUES ($1, $2) RETURNING authorid', [
        authorFirstname,
        authorLastname
      ])

      if (addAuthorStatus.rowCount <= 0) {
        return {
          success: false,
          message: 'Failed while adding Book'
        }
      }

      currentAuthorid = addAuthorStatus.rows[0].authorid
    } else {
      // autor found so get the authorid
      currentAuthorid = getAuthorStatus.rows[0].authorid
    }

    // now add book genres if available or not
    const getBookGenresStatus = await db.query(`SELECT genre_id FROM genres WHERE genres.genre_name = $1`, [bookData.genre])
    let currentGenreId: number

    // genre exits
    if (getBookGenresStatus.rowCount > 0) {
      currentGenreId = getBookGenresStatus.rows[0].genre_id
    } else {
      // genre doesn't exist so add new genre
      const addBookNewGenre = await db.query(`INSERT INTO genres (genre_name) VALUES ($1) RETURNING genre_id`, [
        bookData.genre
      ])
      currentGenreId = addBookNewGenre.rows[0].genre_id
    }

    // now add new book with authorid and payload
    const addBookStatus = await db.query(
      'INSERT INTO books (authorid, title, price, publication_date, book_type, book_condition, available_quantity, isbn, description, genre_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
      [
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
      ]
    )

    if (addBookStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed while adding new book'
      }
    }

    return {
      success: true,
      message: 'Successfully added new book',
      data: addBookStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while adding new book')
    return {
      success: false,
      message: 'Failed while adding new book'
    }
  }
}

// service for updating new books
const UpdateBook = async (bookID: number, newBookInfo: Partial<NewBookPayload>): Promise<ServiceResponse> => {
  try {
    // first get the book from db
    const bookWithId = await db.query('SELECT * FROM books WHERE books.bookid = $1', [bookID])

    if (bookWithId.rowCount <= 0) {
      return {
        success: false,
        message: 'Book is unavailable'
      }
    }

    const oldBookInfo = bookWithId.rows[0]

    // new updated book payload for using in updating book
    const toUpdateBookInfo = Object.assign(oldBookInfo, newBookInfo)

    // update book by db
    const bookUpdateStatus = await db.query(
      'UPDATE books SET title = $1, price = $2, publication_date = $3, book_type = $4, book_condition = $5, available_quantity = $6, isbn = $7, description = $8  WHERE books.bookid = $9 RETURNING *',
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
        message: 'Failed to update book'
      }
    }

    return {
      success: true,
      message: 'Successfully updated book',
      data: bookUpdateStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while updating book')
    return {
      success: false,
      message: 'Failed to update book'
    }
  }
}

// service for updating book genre
const UpdateBookAuthor = async (firstname: string, lastname: string, bookid: number): Promise<ServiceResponse> => {
  try {
    // new genre_id
    let newAuthorid: number

    // verify if Genre exists or not
    const foundBookAuthor = await db.query(
      'SELECT * FROM authors WHERE authors.firstname = $1 AND authors.lastname = $2',
      [firstname, lastname]
    )
    // error while db query
    if (foundBookAuthor.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to update book author'
      }
    } else if (foundBookAuthor.rowCount === 0) {
      // book genre not avaiable
      // create new book genre
      const createNewBookAuthorStatus = await db.query(
        'INSERT INTO authors (firstname, lastname) VALUES ($1, $2) RETURNING *',
        [firstname, lastname]
      )
      newAuthorid = createNewBookAuthorStatus.rows[0].authorid
    } else {
      // book genre available
      newAuthorid = foundBookAuthor.rows[0].authorid
    }

    // update book with new genre_id
    const updateBookAuthor = await db.query('UPDATE books SET authorid = $1 WHERE bookid = $2 RETURNING *', [
      newAuthorid,
      bookid
    ])
    if (updateBookAuthor.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to update book genre'
      }
    }

    return {
      success: true,
      message: 'Successfully Update Book Author',
      data: updateBookAuthor.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while updating book author')
    return {
      success: false,
      message: 'Error while updating book author'
    }
  }
}

// service for updating book genre
const UpdateBookGenre = async (genre: string, bookid: number): Promise<ServiceResponse> => {
  try {
    // new genre_id
    let newGenreId: number

    // verify if Genre exists or not
    const foundBookGenre = await db.query('SELECT * FROM genres WHERE genres.genre_name = $1', [genre])
    // error while db query
    if (foundBookGenre.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to update book genre'
      }
    } else if (foundBookGenre.rowCount === 0) {
      // book genre not avaiable
      // create new book genre
      const createNewBookGenreStatus = await db.query('INSERT INTO genres (genre_name) VALUES ($1) RETURNING *', [
        genre
      ])
      newGenreId = createNewBookGenreStatus.rows[0].genre_id
    } else {
      // book genre available
      newGenreId = foundBookGenre.rows[0].genre_id
    }

    // update book with new genre_id
    const updateBookGenre = await db.query('UPDATE books SET genre_id = $1 WHERE bookid = $2 RETURNING *', [
      newGenreId,
      bookid
    ])
    if (updateBookGenre.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to update book genre'
      }
    }

    return {
      success: true,
      message: 'Successfully Update Boook Genre',
      data: updateBookGenre.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while updating book genre')
    return {
      success: false,
      message: 'Error while updating book genre'
    }
  }
}

// service for removing a book
const RemoveBookWithId = async (bookID: number): Promise<ServiceResponse> => {
  try {
    // get the book with bookid
    const bookWithId = await db.query('SELECT * FROM books WHERE bookid = $1', [bookID])

    // book not found with given bookid
    if (bookWithId.rowCount <= 0) {
      return {
        success: false,
        message: 'Book is not available'
      }
    }

    // get the book images
    const bookImagesWithId = await db.query('SELECT * FROM book_images WHERE bookid = $1', [bookID])
    let deleteBookImagesWithIdStatus: any
    // if only book images exits delete them
    if (bookImagesWithId.rowCount === 2) {
      // and delete book images from cloud
      await removeImageFromCloud(bookImagesWithId.rows[0].img_public_id)
      await removeImageFromCloud(bookImagesWithId.rows[1].img_public_id)
      // then delete book images with bookid from db
      deleteBookImagesWithIdStatus = await db.query('DELETE FROM book_images WHERE bookid = $1 RETURNING *', [bookID])
      if (deleteBookImagesWithIdStatus.rowCount <= 0) {
        return {
          success: false,
          message: 'Failed to delete a book'
        }
      }
    }

    if (bookImagesWithId.rowCount === 1) {
      // and delete book images from cloud
      await removeImageFromCloud(bookImagesWithId.rows[0].img_public_id)
      // then delete book images with bookid from db
      deleteBookImagesWithIdStatus = await db.query('DELETE FROM book_images WHERE bookid = $1 RETURNING *', [bookID])
      if (deleteBookImagesWithIdStatus.rowCount <= 0) {
        return {
          success: false,
          message: 'Failed to delete a book'
        }
      }
    }

    // delete book's reviews
    const foundBookReviews = await db.query('SELECT * FROM reviews WHERE reviews.bookid = $1', [bookID])

    if (foundBookReviews.rowCount > 0) {
      // if reviews found delete them
      const deleteBookReviews = await db.query('DELETE FROM reviews WHERE reviews.bookid = $1 RETURNING *', [bookID])

      if (deleteBookReviews.rowCount <= 0) {
        return {
          success: false,
          message: 'Failed to delete a book'
        }
      }
    }

    // delete carts with this booki
    const foundCarts = await db.query('SELECT * FROM carts WHERE carts.bookid = $1', [bookID])

    if (foundCarts.rowCount > 0) {
      // if carts found delete them
      const deleteCarts = await db.query('DELETE FROM carts WHERE carts.bookid = $1 RETURNING *', [bookID])

      if (deleteCarts.rowCount <= 0) {
        return {
          success: false,
          message: 'Failed to delete a book'
        }
      }
    }

    // now delete book with bookid
    const deleteBookWithIdStatus = await db.query('DELETE FROM books WHERE books.bookid = $1 RETURNING *', [bookID])

    if (deleteBookWithIdStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to delete a book'
      }
    }

    return {
      success: true,
      message: 'Successfully Removed a book',
      data: deleteBookWithIdStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while removing a book')
    return {
      success: false,
      message: 'Error while removing a book'
    }
  }
}

// service to add book image
const AddBookImg = async (bookid: number, imgPath: string, imgType: string): Promise<ServiceResponse> => {
  try {
    // first showing if book is in db or not
    const isBookFound = await db.query('SELECT * FROM books WHERE bookid = $1', [bookid])

    if (isBookFound.rowCount <= 0) {
      return {
        success: false,
        message: 'Book is not available'
      }
    }

    // check if already book image exitst or not
    const isBookImgFound = await db.query('SELECT * FROM book_images WHERE bookid = $1 AND img_type = $2', [
      bookid,
      imgType
    ])

    if (isBookImgFound.rowCount > 0) {
      return {
        success: false,
        message: `Book Image of ${imgType} cover already exits`
      }
    }

    // call util cloudingary upload function
    const imgUploadStatus: ICloudinaryResponse = await uploadImageToCloud(imgPath)

    if (!imgUploadStatus.success) {
      return {
        success: false,
        message: 'Failed to upload book image'
      }
    }

    const imgToDbStatus = await db.query(
      'INSERT INTO book_images(bookid, img_src, img_type, img_public_id) VALUES ($1, $2, $3, $4) RETURNING *',
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
    logger.error(err, 'Error while uploading book image')
    return {
      success: false,
      message: 'Failed to upload book image'
    }
  }
}

// service to upadte book images
const UpdateBookImg = async (bookid: number, imgPath: string, imgType: string): Promise<ServiceResponse> => {
  try {
    // first find if book exits or not
    const isBookFound = await db.query('SELECT * FROM books WHERE bookid = $1', [bookid])

    if (isBookFound.rowCount <= 0) {
      return {
        success: false,
        message: 'Book is not available'
      }
    }

    // then find if book image exits or not
    const isBookImgFound = await db.query('SELECT * FROM book_images WHERE bookid = $1 AND img_type = $2', [
      bookid,
      imgType
    ])

    if (isBookImgFound.rowCount <= 0) {
      return {
        success: false,
        message: 'Book images not found ! Upload them first'
      }
    }

    // get the public_id of book images
    const imgPublicId = await isBookImgFound.rows[0].img_public_id

    // call util cloudingary update function
    const imgUpdateStatus: ICloudinaryResponse = await updateImageToCloud(imgPath, imgPublicId)

    if (!imgUpdateStatus.success) {
      return {
        ...imgUpdateStatus
      }
    }

    return {
      success: true,
      message: 'Successfully updated book images'
    }
  } catch (err) {
    logger.error(err, 'Error while updating book images')
    return {
      success: false,
      message: 'Failed to update book images'
    }
  }
}

// service to delete book image
const DeleteBookImage = async (bookid: number, imgType: string): Promise<ServiceResponse> => {
  try {
    // first show if book images
    const isBookImgFound = await db.query('SELECT * FROM book_images WHERE bookid = $1 AND img_type = $2', [
      bookid,
      imgType
    ])

    if (isBookImgFound.rowCount <= 0) {
      return {
        success: false,
        message: 'No Book images found'
      }
    }

    // call util remove image from cloud
    const removeImgFromCloudStatus: ICloudinaryResponse = await removeImageFromCloud(
      isBookImgFound.rows[0].img_public_id
    )

    if (!removeImgFromCloudStatus.success) {
      return {
        success: false,
        message: 'Failed to remove book image'
      }
    }

    // remove images from db
    const bookImgRemoveStatus = await db.query('DELETE FROM book_images WHERE bookid = $1 AND img_type = $2', [
      bookid,
      imgType
    ])

    if (bookImgRemoveStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to remove book image'
      }
    }

    return {
      success: true,
      message: 'Successfully removed book image'
    }
  } catch (err) {
    logger.error(err, 'Error while removing book image')
    return {
      success: false,
      message: 'Failed to remove book image'
    }
  }
}

export {
  GetAllBooks,
  GetOnlyOneBook,
  AddBook,
  UpdateBook,
  UpdateBookAuthor,
  UpdateBookGenre,
  RemoveBookWithId,
  AddBookImg,
  UpdateBookImg,
  DeleteBookImage
}
