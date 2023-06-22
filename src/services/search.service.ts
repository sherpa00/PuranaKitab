import { db } from '../configs/db.configs'
import logger from '../utils/logger.utils'
import type { ServiceResponse } from '../types'

// service for searching books
const SearchBooks = async (searchQuery: string, searchBy: string): Promise<ServiceResponse> => {
  try {
    // get if exits -> search query, search by
    const queryString: string = searchQuery !== null && searchQuery !== undefined ? searchQuery : ''
    const searchingBy: string = searchBy !== null && searchBy !== undefined ? searchBy : 'title'

    // db search with search query and search by
    let searchResults: any
    if (searchingBy === 'title') {
      searchResults = await db.query("SELECT * FROM books WHERE books.title LIKE '%$1%'", [queryString])
    } else if (searchingBy === 'author') {
      searchResults = await db.query("SELECT * FROM books WHERE books.author LIKE '%$1%'", [queryString])
    } else if (searchingBy === 'description') {
      searchResults = await db.query(
        "SELECT * FROM books WHERE to_tsvector('simple', description) @@ to_tsquery('simple', $1)",
        [queryString]
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
      message: 'Successfully search books',
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
