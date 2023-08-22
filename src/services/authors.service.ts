/* eslint-disable quotes */
import { db } from '../configs/db.configs'
import generatePaginationMetadata from '../helpers/generatePaginationMetadata'
import { type IPaginationMetadata, type ServiceResponse } from '../types'
import logger from '../utils/logger.utils'

// service to get all book services
const GetAllBookAuthors = async (page?: number, size?: number): Promise<ServiceResponse> => {
  try {

    // count authors
    const getBookAuthorsCount = await db.query(`SELECT COUNT(*) FROM authors`)

    if (getBookAuthorsCount.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to get all book authors'
      }
    }

    let getBookAuthorsStatus: any
    if (page !== null && page !== undefined && size !== null && size !== undefined) {
      // pagination is given
      // eslint-disable-next-line quotes
      getBookAuthorsStatus = await db.query(
        `SELECT *,CONCAT(authors.firstname, ' ', authors.lastname) AS fullname  FROM authors ORDER BY CONCAT(authors.firstname, ' ', authors.lastname) ASC LIMIT $1 OFFSET ($2 - 1) * $1`,
        [size, page]
      )
    } else {
      // pagination not given
      getBookAuthorsStatus = await db.query(
        `SELECT *,CONCAT(authors.firstname, ' ', authors.lastname) AS fullname FROM authors ORDER BY CONCAT(authors.firstname, ' ', authors.lastname)`
      )
    }

    if (getBookAuthorsStatus.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to get all book authors'
      }
    }

    // genreate paginaton metadata
    const getBookAuthorsPaginationMetadata: IPaginationMetadata = generatePaginationMetadata(
      getBookAuthorsCount.rows[0].count,
      page !== null && page !== undefined ? page : 1,
      size !== null && size !== undefined ? size : getBookAuthorsCount.rows[0].count
    )

    return {
      success: true,
      message: 'Successfully got all book authors',
      data: {
        pagination: {
          ...getBookAuthorsPaginationMetadata
        },
        results: getBookAuthorsStatus.rows
      }
    }
  } catch (err) {
    logger.error(err, 'Error while getting all book authors')
    return {
      success: false,
      message: 'Failed to get all book authors'
    }
  }
}

// service for adding new book authors
const AddNewBookAuthor = async (firstname: string, lastname: string): Promise<ServiceResponse> => {
  try {
    // verify if book authors already exists or not
    const foundBookAuthor = await db.query(
      'SELECT COUNT(*) FROM authors WHERE authors.firstname = $1 AND authors.lastname = $2',
      [firstname, lastname]
    )

    if (foundBookAuthor.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to add new book author'
      }
    }

    if (foundBookAuthor.rows[0].count > 0) {
      return {
        success: false,
        message: 'Book Author already exists'
      }
    }

    // add new book authors
    const addNewBookAuthorStatus = await db.query(
      'INSERT INTO authors (firstname, lastname) VALUES ($1, $2) RETURNING *',
      [firstname, lastname]
    )

    if (addNewBookAuthorStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to add new book author'
      }
    }

    return {
      success: true,
      message: 'Successfully added new book author',
      data: addNewBookAuthorStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while adding new book author')
    return {
      success: false,
      message: 'Failed to add new book author'
    }
  }
}

// service to update book authors
const UpdateAuthor = async (authorid: number, firstname: string, lastname: string): Promise<ServiceResponse> => {
  try {
    // verify if book authors already exists or not
    const foundBookAuthor = await db.query('SELECT * FROM authors WHERE authors.authorid = $1', [authorid])

    if (foundBookAuthor.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to update book author'
      }
    }

    if (foundBookAuthor.rowCount === 0) {
      return {
        success: false,
        message: 'Book Author is not available'
      }
    }

    // set missing values
    const newFirstname: string =
      firstname !== null && firstname !== undefined ? firstname : foundBookAuthor.rows[0].firstname
    const newLastname: string =
      lastname !== null && lastname !== undefined ? lastname : foundBookAuthor.rows[0].lastname

    // update book author
    const updateBookAuthorStatus = await db.query(
      `UPDATE authors SET firstname = $1, lastname = $2 WHERE authors.authorid = $3 RETURNING *`,
      [newFirstname, newLastname, authorid]
    )

    if (updateBookAuthorStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to update book author'
      }
    }

    return {
      success: true,
      message: 'Successfully updated book author',
      data: updateBookAuthorStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while updating book author')
    return {
      success: false,
      message: 'Failed to update book author'
    }
  }
}

// service for removing book author
const RemoveAuthor = async (authorid: number): Promise<ServiceResponse> => {
  try {
    // verify if book author exist or not
    const foundBookAuthor = await db.query('SELECT COUNT(*) FROM authors WHERE authors.authorid = $1', [authorid])

    if (foundBookAuthor.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to remove book author'
      }
    }

    if (foundBookAuthor.rows[0].count === 0) {
      return {
        success: false,
        message: 'Book Author is not available'
      }
    }

    // remove author
    const removeAuthorStatus = await db.query('DELETE FROM authors WHERE authors.authorid = $1 RETURNING *', [authorid])

    if (removeAuthorStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to remove book author'
      }
    }

    return {
      success: true,
      message: 'Successfully removed book author',
      data: removeAuthorStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while removing book author')
    return {
      success: false,
      message: 'Failed to remove book author'
    }
  }
}

export { GetAllBookAuthors, AddNewBookAuthor, UpdateAuthor, RemoveAuthor }
