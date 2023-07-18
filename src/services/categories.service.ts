import { db } from '../configs/db.configs'
import generatePaginationMetadata from '../helpers/generatePaginationMetadata'
import { type IPaginationMetadata, type ServiceResponse } from '../types'
import logger from '../utils/logger.utils'

const GetCategoriesBestSeller = async (page: number, size: number) : Promise<ServiceResponse> => {
    try {
        // count the best seller books from db for pagination metadata
        const countBestSellerBooks = await db.query(
            `SELECT 
                COUNT(*) 
            FROM 
                books
            INNER JOIN book_sales ON books.bookid = book_sales.bookid
            `
        )

        // get the best seller books from db
        const getBestSeller = await db.query(
            // eslint-disable-next-line quotes
            `SELECT
                books.*,
                authors.firstname AS author_firstname,
                authors.lastname AS author_lastname,
                genres.genre_name,
                front_book_image.img_src AS front_img_src,
                back_book_image.img_src AS back_img_src
            FROM
                books
            LEFT JOIN authors ON books.authorid = authors.authorid
            LEFT JOIN genres ON books.genre_id = genres.genre_id
            LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
            LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
            INNER JOIN book_sales ON books.bookid = book_sales.bookid
            ORDER BY book_sales.sales_count DESC
            LIMIT $1 OFFSET ($2 - 1) * $1;
          `,
          [size, page]
        )

        if (getBestSeller.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to get best seller category'
            }
        }

        const getBestSellerPaginationMetaData: IPaginationMetadata = generatePaginationMetadata(
            countBestSellerBooks.rows[0].count,
            page ?? 1,
            size ?? countBestSellerBooks.rows[0].count
        )

        return {
            success: true,
            message: 'Successfully got the best seller category',
            data: {
                pagination: {
                    ...getBestSellerPaginationMetaData
                },
                results: getBestSeller.rows
            }
        }
    } catch(err) {
        logger.error(err, 'Error while getting best seller category')
        return {
            success: false,
            message: 'Failed to get the best seller category'
        }
    }
}

export {GetCategoriesBestSeller}