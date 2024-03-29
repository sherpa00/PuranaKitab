import { db } from '../configs/db.configs'
import generatePaginationMetadata from '../helpers/generatePaginationMetadata'
import { type IPaginationMetadata, type ServiceResponse } from '../types'
import logger from '../utils/logger.utils'

// service to get all book genres
const GetBookGenres = async (page?: number, size?: number): Promise<ServiceResponse> => {
  try {
    // count book genres
    const countBookGenres = await db.query('SELECT COUNT(*) FROM genres')

    if (countBookGenres.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to get book genres'
      }
    }

    // get book genres
    let getBookGenresStatus: any

    if (page !== undefined && page !== null && size !== undefined && page !== null) {
      // pagination given
      getBookGenresStatus = await db.query(
        'SELECT * FROM genres ORDER BY genres.genre_name ASC LIMIT $1 OFFSET ($2 - 1) * $1',
        [size, page]
      )
    } else {
      // pagination not given
      getBookGenresStatus = await db.query('SELECT * FROM genres ORDER BY genres.genre_name ASC')
    }

    // genreate pagination metadata
    const getBookGenresPaginationMetadata: IPaginationMetadata = generatePaginationMetadata(
      countBookGenres.rows[0].count,
      page ?? 1,
      size ?? countBookGenres.rows[0].count
    )

    return {
      success: true,
      message: 'Successfully got all book genres',
      data: {
        pagination: {
          ...getBookGenresPaginationMetadata
        },
        results: getBookGenresStatus.rows
      }
    }
  } catch (err) {
    logger.error(err, 'Error while getting all book genres')
    return {
      success: false,
      message: 'Failed to get all book genres'
    }
  }
}

// service to add new book genre
const AddBookGenre = async (genreName: string): Promise<ServiceResponse> => {
  try {
    // verify if book genre already exists or not
    const foundBookGenre = await db.query('SELECT COUNT(*) FROM genres WHERE genres.genre_name = $1', [genreName])

    if (foundBookGenre.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to add book genre'
      }
    }

    if (foundBookGenre.rows[0].count > 0) {
      return {
        success: false,
        message: 'Book genre is already available'
      }
    }

    // add genre
    const addBookGenreStatus = await db.query('INSERT INTO genres (genre_name) VALUES ($1) RETURNING *', [genreName])

    if (addBookGenreStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to add book genre'
      }
    }

    return {
      success: true,
      message: 'Successfully added book genre',
      data: addBookGenreStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while adding new book genre')
    return {
      success: false,
      message: 'Failed to add book genre'
    }
  }
}

// service to update book genre
const UpdateGenre = async (genreId: number, genreName: string): Promise<ServiceResponse> => {
  try {
    // verify if book genre already exists or not
    const foundBookGenre = await db.query('SELECT COUNT(*) FROM genres WHERE genres.genre_id = $1', [genreId])

    if (foundBookGenre.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to update book genre'
      }
    }

    if (foundBookGenre.rows[0].count === 0) {
      return {
        success: false,
        message: 'Book genre is not available'
      }
    }

    // update genre
    const updateBookGenreStatus = await db.query('UPDATE genres SET genre_name = $1 WHERE genre_id = $2 RETURNING *', [
      genreName,
      genreId
    ])

    if (updateBookGenreStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to updated book genre'
      }
    }

    return {
      success: true,
      message: 'Successfully updated book genre',
      data: updateBookGenreStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while updating book genre')
    return {
      success: false,
      message: 'Failed to update book genre'
    }
  }
}

// service to delete book genre
const DeleteGenre = async (genreId: number): Promise<ServiceResponse> => {
  try {
    // verify if book genre already exists or not
    const foundBookGenre = await db.query('SELECT COUNT(*) FROM genres WHERE genres.genre_id = $1', [genreId])

    if (foundBookGenre.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to remove book genre'
      }
    }

    if (foundBookGenre.rows[0].count === 0) {
      return {
        success: false,
        message: 'Book genre is not available'
      }
    }

    // delete genre
    const updateBookGenreStatus = await db.query('DELETE FROM genres WHERE genre_id = $1 RETURNING *', [genreId])

    if (updateBookGenreStatus.rowCount <= 0) {
      return {
        success: false,
        message: 'Failed to remove book genre'
      }
    }

    return {
      success: true,
      message: 'Successfully removed book genre',
      data: updateBookGenreStatus.rows[0]
    }
  } catch (err) {
    logger.error(err, 'Error while removing book genre')
    return {
      success: false,
      message: 'Failed to remove book genre'
    }
  }
}

export { GetBookGenres, AddBookGenre, UpdateGenre, DeleteGenre }
