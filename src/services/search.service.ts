/* eslint-disable quotes */
import { db } from '../configs/db.configs'
import logger from '../utils/logger.utils'
import type { IPaginationMetadata, ServiceResponse } from '../types'
import generatePaginationMetadata from '../helpers/generatePaginationMetadata'

// service for searching books
const SearchBooks = async (
  searchQuery: string,
  searchBy: string,
  searchPage: number,
  searchSize: number
): Promise<ServiceResponse> => {
  try {
    // db search with search query and search by
    let searchResults: any
    let countSearchResults: any
    if (searchBy === 'title') {
      // get total search results
      countSearchResults = await db.query(`SELECT COUNT(*) FROM books WHERE books.title ILIKE '%' || $1 || '%'`, [
        searchQuery
      ])
      searchResults = await db.query(
        `SELECT * FROM books WHERE books.title ILIKE '%' || $1 || '%' ORDER BY bookid LIMIT $2 OFFSET ($3 - 1) * $4`,
        [searchQuery, searchSize, searchPage, searchSize]
      )
    } else if (searchBy === 'author') {
      // get total search results
      countSearchResults = await db.query(
        `SELECT COUNT(*) FROM books INNER JOIN authors ON books.authorid = authors.authorid WHERE CONCAT(authors.firstname, ' ', authors.lastname) ILIKE '%' || $1 || '%'`,
        [searchQuery]
      )
      // search in authors
      searchResults = await db.query(
        `SELECT books.* FROM books INNER JOIN authors ON books.authorid = authors.authorid WHERE CONCAT(authors.firstname, ' ', authors.lastname) ILIKE '%' || $1 || '%' ORDER BY books.bookid LIMIT $2 OFFSET ($3 - 1) * $4`,
        [searchQuery, searchSize, searchPage, searchSize]
      )
    } else if (searchBy === 'description') {
      // get search results count
      countSearchResults = await db.query(
        `SELECT COUNT(*) FROM books WHERE to_tsvector('simple', books.description) @@ to_tsquery('simple', $1)`,
        [searchQuery]
      )
      searchResults = await db.query(
        `SELECT * FROM books WHERE to_tsvector('simple', books.description) @@ to_tsquery('simple', $1) ORDER BY books.bookid LIMIT $2 OFFSET ($3 - 1) * $4`,
        [searchQuery, searchSize, searchPage, searchSize]
      )
    } else {
      return {
        success: false,
        message: 'Books search by invalid'
      }
    }

    if (countSearchResults.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to search books'
      }
    }

    if (searchResults?.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to search books'
      }
    }

    // pagination metadata for books search
    const searchPaginationMetadata: IPaginationMetadata = generatePaginationMetadata(
      countSearchResults.rows[0].count,
      searchPage,
      searchSize
    )

    return {
      success: true,
      message: 'Successfully searched books',
      data: {
        pagination: {
          ...searchPaginationMetadata
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
