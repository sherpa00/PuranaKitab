/* eslint-disable quotes */
import { db } from '../configs/db.configs'
import generatePaginationMetadata from '../helpers/generatePaginationMetadata'
import { type IPaginationMetadata, type ServiceResponse } from '../types'
import logger from '../utils/logger.utils'

// service to get all book services
const GetAllBookAuthors = async (page?: number, size?: number): Promise<ServiceResponse> => {
  try {
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

    // count authors
    const getBookAuthorsCount = await db.query(`SELECT COUNT(*) FROM authors`)

    if (getBookAuthorsCount.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to get book authors'
      }
    }

    if (getBookAuthorsStatus.rowCount < 0) {
      return {
        success: false,
        message: 'Failed to get book authors'
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
        result: getBookAuthorsStatus.rows
      }
    }
  } catch (err) {
    logger.error(err, 'Error while getting all book authors')
    return {
      success: false,
      message: 'Error while getting all book authors'
    }
  }
}

export { GetAllBookAuthors }
