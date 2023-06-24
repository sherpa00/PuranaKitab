/* eslint-disable quotes */
import { db } from '../configs/db.configs'
import logger from '../utils/logger.utils'
import type { IPaginationMetadata, ServiceResponse } from '../types'
import generatePaginationMetadata from '../helpers/generatePaginationMetadata'

// service for searching books
const SearchBooks = async (
  searchQuery: string,
  searchBy: string,
  searchGenre: string | null | undefined,
  searchPage: number,
  searchSize: number
): Promise<ServiceResponse> => {
  try {
    // db search with search query and search by
    let searchResults: any
    let countSearchResults: any

    if (searchBy === 'title') {
      // get total search results
      countSearchResults = await db.query(
        `SELECT COUNT(*) FROM books LEFT JOIN genres ON books.genre_id = genres.genre_id WHERE books.title ILIKE '%' || $1 || '%' AND (genres.genre_name = $2 OR $2 IS NULL)`,
        [searchQuery, searchGenre]
      )
      searchResults = await db.query(
        `SELECT * FROM books LEFT JOIN genres ON books.genre_id = genres.genre_id WHERE books.title ILIKE '%' || $1 || '%' AND (genres.genre_name = $2 OR $2 IS NULL) LIMIT $3 OFFSET ($4 - 1) * $3`,
        [searchQuery, searchGenre, searchSize, searchPage]
      )
    } else if (searchBy === 'author') {
      // get total search results
      countSearchResults = await db.query(
        `SELECT COUNT(*) FROM books INNER JOIN authors ON books.authorid = authors.authorid LEFT JOIN genres ON books.genre_id = genres.genre_id WHERE CONCAT(authors.firstname, ' ', authors.lastname) ILIKE '%' || $1 || '%' AND (genres.genre_name = $2 OR $2 IS NULL)`,
        [searchQuery, searchGenre]
      )
      // search in authors
      searchResults = await db.query(
        `SELECT books.* FROM books INNER JOIN authors ON books.authorid = authors.authorid LEFT JOIN genres ON books.genre_id = genres.genre_id WHERE CONCAT(authors.firstname, ' ', authors.lastname) ILIKE '%' || $1 || '%' AND (genres.genre_name = $2 OR $2 IS NULL) LIMIT $3 OFFSET ($4 - 1) * $3`,
        [searchQuery, searchGenre, searchSize, searchPage]
      )
    } else if (searchBy === 'description') {
      // get search results count
      countSearchResults = await db.query(
        `SELECT COUNT(*) FROM books LEFT JOIN genres ON books.genre_id = genres.genre_id WHERE to_tsvector('simple', books.description) @@ to_tsquery('simple', $1) AND (genres.genre_name = $2 OR $2 IS NULL)`,
        [searchQuery, searchGenre]
      )
      searchResults = await db.query(
        `SELECT * FROM books LEFT JOIN genres ON books.genre_id = genres.genre_id WHERE to_tsvector('simple', books.description) @@ to_tsquery('simple', $1) AND (genres.genre_name = $2 OR $2 IS NULL) LIMIT $3 OFFSET ($4 - 1) * $3`,
        [searchQuery, searchGenre, searchSize, searchPage]
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
