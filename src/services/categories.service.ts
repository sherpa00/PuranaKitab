import { db } from '../configs/db.configs'
import generatePaginationMetadata from '../helpers/generatePaginationMetadata'
import { type IPaginationMetadata, type ServiceResponse } from '../types'
import logger from '../utils/logger.utils'

// category service -> Best Seller books
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

// category service -> Top Rated books
const GetCategoriesTopRated = async (page: number, size: number): Promise<ServiceResponse> => {
    try {
        // count the top rated books for pagination metadata
        const countTopRatedBooks = await db.query(
            `SELECT
                books.bookid,
                COALESCE(AVG(reviews.stars), 0) AS avg_rating
            FROM 
                books
            LEFT JOIN reviews ON books.bookid = reviews.bookid
            GROUP BY books.bookid`
        )

        // get the top rated books by db
        const getTopRated = await db.query(
            `SELECT
                books.*,
                authors.firstname AS author_firstname,
                authors.lastname AS author_lastname,
                genres.genre_name,
                front_book_image.img_src AS front_img_src,
                back_book_image.img_src AS back_img_src,
                COALESCE(AVG(reviews.stars),0) AS avg_rating
            FROM
                books
            LEFT JOIN reviews ON books.bookid = reviews.bookid
            LEFT JOIN authors ON authors.authorid = books.authorid
            LEFT JOIN genres ON genres.genre_id = books.genre_id
            LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
            LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
            GROUP BY books.bookid, authors.firstname, authors.lastname, genres.genre_name, front_book_image.img_src, back_book_image.img_src
            ORDER BY avg_rating DESC
            LIMIT $1 OFFSET ($2 - 1) * $1`,
            [size, page]
        )

        if (getTopRated.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to get top rated category'
            }
        }

        const getTopRatedBooksPaginationMetadata: IPaginationMetadata = generatePaginationMetadata(
            countTopRatedBooks.rowCount,
            page ?? 1,
            size ?? countTopRatedBooks.rowCount
        )

        return {
            success: true,
            message: 'Successfully got the top rated category',
            data: {
                pagination: {
                    ...getTopRatedBooksPaginationMetadata
                },
                results: getTopRated.rows
            }
        }
    } catch (err) {
        logger.error(err, 'Errro while getting top rated category')
        return {
            success: false,
            message: 'Failed to get the top rated category'
        }
    }
}

// category service -> New Arrivals
const GetCategoriesNewArrivals = async (page: number, size: number): Promise<ServiceResponse> => {
    try {
        const currentDate: Date = new Date()
        const fiveYearsAgo: Date = new Date(currentDate.getFullYear() - 5, 0, 1) // date five years ago

        // count the new arrivals books from db
        const countNewArrivalsBooks = await db.query(
            `SELECT
                COUNT(*)
            FROM
                books
            WHERE books.publication_date BETWEEN $1 AND $2`,
            [fiveYearsAgo, currentDate]
        )

        // get the new arrivals from db
        const getNewArrivals = await db.query(
            `SELECT
                books.*,
                authors.firstname AS author_firstname,
                authors.lastname AS author_lastname,
                genres.genre_name,
                front_book_image.img_src AS front_img_src,
                back_book_image.img_src AS back_img_src
            FROM
                books
            LEFT JOIN authors ON authors.authorid = books.authorid
            LEFT JOIN genres ON genres.genre_id = books.genre_id
            LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
            LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
            WHERE books.publication_date BETWEEN $1 AND $2
            ORDER BY books.publication_date DESC
            LIMIT $3 OFFSET ($4 - 1) * $3`,
            [fiveYearsAgo, currentDate, size, page]
        )

        if (getNewArrivals.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to get the new arrivals category'
            }
        }

        const getNewArrivalsPaginationMetadata: IPaginationMetadata = generatePaginationMetadata(
            countNewArrivalsBooks.rows[0].count,
            page ?? 1,
            size ?? countNewArrivalsBooks.rows[0].count
        )

        return {
            success: true,
            message: 'Successfully got the new arrivals category',
            data: {
                pagination: {
                    ...getNewArrivalsPaginationMetadata
                },
                results: getNewArrivals.rows
            }
        }

    } catch (err) {
        logger.error(err, 'Error while getting new arrivals category')
        return {
            success: false,
            message: 'Failed to get new arrivals category'
        }
    }
}

// category service -> Recently Added
const GetCategoriesRecentlyAdded = async (page: number, size: number): Promise<ServiceResponse> => {
    try {
        const currentDate: Date = new Date()
        const startOfYear: Date = new Date(currentDate.getFullYear(), 0, 1) // start of current year

        // count the recently added books from db
        const countRecentlyAdded = await db.query(
            `SELECT
                COUNT(*)
            FROM
                books
            WHERE books.createdat BETWEEN $1 AND $2`,
            [startOfYear, currentDate]
        )

        // get the new arrivals from db
        const getRecentlyAdded = await db.query(
            `SELECT
                books.*,
                authors.firstname AS author_firstname,
                authors.lastname AS author_lastname,
                genres.genre_name,
                front_book_image.img_src AS front_img_src,
                back_book_image.img_src AS back_img_src
            FROM
                books
            LEFT JOIN authors ON authors.authorid = books.authorid
            LEFT JOIN genres ON genres.genre_id = books.genre_id
            LEFT JOIN book_images AS front_book_image ON books.bookid = front_book_image.bookid AND front_book_image.img_type = 'FRONT'
            LEFT JOIN book_images AS back_book_image ON books.bookid = back_book_image.bookid AND back_book_image.img_type = 'BACK'
            WHERE books.createdat BETWEEN $1 AND $2
            ORDER By books.createdat DESC
            LIMIT $3 OFFSET ($4 - 1) * $3`,
            [startOfYear, currentDate, size, page]
        )

        if (getRecentlyAdded.rowCount < 0) {
            return {
                success: false,
                message: 'Failed to get the recently added category'
            }
        }

        const getRecentlyAddedPaginationMetadata: IPaginationMetadata = generatePaginationMetadata(
            countRecentlyAdded.rows[0].count,
            page ?? 1,
            size ?? countRecentlyAdded.rows[0].count
        )

        return {
            success: true,
            message: 'Successfully got the new arrivals category',
            data: {
                pagination: {
                    ...getRecentlyAddedPaginationMetadata
                },
                results: getRecentlyAdded.rows            
            }
        }

    } catch (err) {
        logger.error(err, 'Error while getting recently added category')
        return {
            success: false,
            message: 'Failed to get recently added category'
        }
    }
}

export {GetCategoriesBestSeller,GetCategoriesTopRated, GetCategoriesNewArrivals, GetCategoriesRecentlyAdded}