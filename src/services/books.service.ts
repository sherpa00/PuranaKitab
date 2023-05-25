import { type IBook } from '../types'
import { db } from '../configs/db.configs'

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
      `INSERT INTO books (authorid, title, price, publication_date, book_type, book_condition, available_quantity, isbn) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        currentAuthorid,
        bookData.title,
        bookData.price,
        bookData.publication_date,
        bookData.book_type,
        bookData.book_condition,
        bookData.available_quantity,
        bookData.isbn
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

export { GetAllBooks, GetOnlyOneBook, AddBook }
