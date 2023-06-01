import { type IBook } from '../types'
import { db } from '../configs/db.configs'
import uploadImage, { type ICloudinaryResponse } from '../utils/cloudinary.utils'

export type NewBookPayload = Omit<IBook, 'createdat' | 'bookid' | 'authorid'>

export interface BookStatusInfo {
  success: boolean
  message: string
  data?: any
}

// service for getting all books
const GetAllBooks = async (): Promise<BookStatusInfo> => {
  try {
    const getBooksStatus = await db.query(`SELECT * FROM books`)

    if (getBooksStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'No Books found'
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
}

// service for getting all books
const GetOnlyOneBook = async (bookID: number): Promise<BookStatusInfo> => {
  try {
    const getBooksStatus = await db.query(`SELECT * FROM books WHERE books.bookid = $1`, [bookID])

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
}

// service for adding new books
const AddBook = async (
  bookData: NewBookPayload,
  authorFirstname: string,
  authorLastname: string
): Promise<BookStatusInfo> => {
  try {
    // first getting author and coparing if authors exits then not adding or else adding
    const getAuthorStatus = await db.query(`SELECT * FROM authors WHERE firstname = $1 AND lastname = $2`, [
      authorFirstname,
      authorLastname
    ])

    // authorid of new or found author
    let currentAuthorid: number

    if (getAuthorStatus.rowCount <= 0) {
      // no author found so add new author
      const addAuthorStatus = await db.query(`INSERT INTO authors (firstname, lastname) VALUES ($1, $2) RETURNING *`, [
        authorFirstname,
        authorLastname
      ])

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
    const addBookStatus = await db.query(
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
}

// service for updating new books
const UpdateBook = async (bookID: number, newBookInfo: Partial<NewBookPayload>): Promise<BookStatusInfo> => {
  try {
    // first get the book from db
    const bookWithId = await db.query(`SELECT * FROM books WHERE books.bookid = $1`, [bookID])

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
    const bookUpdateStatus = await db.query(
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
}

// service for removing a book
const RemoveBookWithId = async (bookID: number): Promise<BookStatusInfo> => {
  try {
    // get the book with bookid
    const bookWithId = await db.query(`SELECT * FROM books WHERE bookid = $1`, [bookID])

    // book not found with given bookid
    if (bookWithId.rowCount <= 0) {
      return {
        success: false,
        message: 'No Book with ID ' + String(bookID) + ' found'
      }
    }

    // now delete book with bookid
    const deleteBookWithIdStatus = await db.query(`DELETE FROM books WHERE books.bookid = $1 RETURNING *`, [bookID])

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
}

// service to add book image
const AddBookImg = async (imgPath: string): Promise<BookStatusInfo> => {
  try {
    // call util cloudingary upload function
    const imgUploadStatus: ICloudinaryResponse = await uploadImage(imgPath)

    if (!imgUploadStatus.success) {
      return {
        success: false,
        message: 'Failed to upload book image'
      }
    }

    return {
      success: true,
      message: imgUploadStatus.message,
      data: {
        url: imgUploadStatus.imgURL
      }
    }
  } catch (err) {
    console.log(err)
    return {
      success: false,
      message: 'Failed to upload book image'
    }
  }
}

export { GetAllBooks, GetOnlyOneBook, AddBook, UpdateBook, RemoveBookWithId, AddBookImg }
