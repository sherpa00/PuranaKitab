/* eslint-disable quotes */
import { db } from '../configs/db.configs'
import logger from '../utils/logger.utils'
import type { ServiceResponse } from '../types'

// service for searching books
const SearchBooks = async (searchQuery: string, searchBy: string): Promise<ServiceResponse> => {
  try {
    // db search with search query and search by
    let searchResults: any
    if (searchBy === 'title') {
      searchResults = await db.query(`SELECT * FROM books WHERE books.title ILIKE '%' || $1 || '%'`, [searchQuery])
    } else if (searchBy === 'author') {
      // search in authors
      searchResults = await db.query(
        `SELECT * FROM books INNER JOIN authors ON books.authorid = authors.authorid WHERE CONCAT(authors.firstname, ' ', authors.lastname) ILIKE '%' || $1 || '%'`,
        [searchQuery]
      )
    } else if (searchBy === 'description') {
      searchResults = await db.query(
        `SELECT * FROM books WHERE to_tsvector('simple', books.description) @@ to_tsquery('simple', $1)`,
        [searchQuery]
      )
    } else {
      return {
        success: false,
        message: 'Books search by invalid'
      }
    }

    if (searchResults?.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to search books'
      }
    }

    return {
      success: true,
      message: 'Successfully searched books',
      data: searchResults.rows
    }
  } catch (err) {
    logger.error(err, 'Error while search books')
    return {
      success: false,
      message: 'Error while searching books'
    }
  }
}

export { SearchBooks }
