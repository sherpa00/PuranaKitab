import { db } from '../configs/db.configs'
import generatePaginationMetadata from '../helpers/generatePaginationMetadata'
import { type IPaginationMetadata, type ServiceResponse } from '../types'
import logger from '../utils/logger.utils'

// service to get all book genres
const GetBookGenres = async(page?: number, size?: number): Promise<ServiceResponse> => {
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
            getBookGenresStatus = await db.query('SELECT * FROM genres ORDER BY genres.genre_name ASC LIMIT $1 OFFSET ($2 - 1) * $1',[
                size,
                page
            ])
        } else {
            // pagination not given
            getBookGenresStatus = await db.query('SELECT * FROM genres ORDER BY genres.genre_name ASC')
        }

        // genreate pagination metadata
        const getBookGenresPaginationMetadata: IPaginationMetadata = generatePaginationMetadata(
            countBookGenres.rows[0].count,
            page !== null && page !== undefined ? page : 1,
            size !== null && size !== undefined ? size : countBookGenres.rows[0].count
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
            message: 'Error while getting all book genres'
        }
    }
}

export {GetBookGenres}