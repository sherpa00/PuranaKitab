/* eslint-disable quotes */
import { db } from '../configs/db.configs'
import logger from '../utils/logger.utils'
import type { ServiceResponse } from '../types'

// service for searching books
const SearchBooks = async (searchQuery: string, searchBy: string, searchPage: number, searchLimit: number): Promise<ServiceResponse> => {
  try {
    // db search with search query and search by
    let searchResults: any
    if (searchBy === 'title') {
      searchResults = await db.query(`SELECT * FROM books WHERE books.title ILIKE '%' || $1 || '%' ORDER BY bookid LIMIT $2 OFFSET ($3 - 1) * $4`, [
        searchQuery,
        searchLimit,
        searchPage,
        searchLimit
      ])
    } else if (searchBy === 'author') {
      // search in authors
      searchResults = await db.query(
        `SELECT books.* FROM books INNER JOIN authors ON books.authorid = authors.authorid WHERE CONCAT(authors.firstname, ' ', authors.lastname) ILIKE '%' || $1 || '%' ORDER BY books.bookid LIMIT $2 OFFSET ($3 - 1) * $4`,
        [
          searchQuery,
          searchLimit,
          searchPage,
          searchLimit
        ]
      )
    } else if (searchBy === 'description') {
      searchResults = await db.query(
        `SELECT * FROM books WHERE to_tsvector('simple', books.description) @@ to_tsquery('simple', $1) ORDER BY books.bookid LIMIT $2 OFFSET ($3 - 1) * $4`,
        [
          searchQuery,
          searchLimit,
          searchPage,
          searchLimit
        ]
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

    // pagination metadata
    const totalResult: number = searchResults.rowCount
    const totalPages: number = Math.ceil(totalResult / searchLimit)
    const hasNextPage: boolean = searchPage < totalPages
    const hasPreviousPage: boolean = searchPage > 1

    return {
      success: true,
      message: 'Successfully searched books',
      data: {
        pagination: {
          total_result: totalResult,
          total_pages: totalPages,
          current_page: searchPage,
          has_next_page: hasNextPage,
          has_previous_page: hasPreviousPage
        },
        results: searchResults.rows
      }
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
