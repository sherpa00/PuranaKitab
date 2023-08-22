/* eslint-disable @typescript-eslint/no-unused-vars */
import {db} from '../../configs/db.configs'
import generatePaginationMetadata from '../../helpers/generatePaginationMetadata'
import { type IPaginationMetadata } from '../../types'
import { type ISortByToOrderBy, convertToDbOrderBy } from '../../helpers/convertSortByToDbOrderBy'
import { SearchBooks } from '../../services/search.service'


jest.mock('../../configs/db.configs.ts', () => ({
    db: {
        query: jest.fn()
    }
}))
jest.mock('../../helpers/convertSortByToDbOrderBy.ts', () => ({
    convertToDbOrderBy: jest.fn()
}))
jest.mock('../../helpers/generatePaginationMetadata.ts')

describe('Testing books search service', () => {
    const searchQuery: string = 'temp'
    const searchBy: string = 'title'
    const searchGenre: string = 'anime'
    const page: number = 1
    const size: number = 1
    const searchSortBy: string = 'most_reviewed'
    const searchBookCondition: string = 'GOOD'
    const searchMinPrice: number = 100
    const searchMaxPrice: number = 1000

    const mockedCountBooksByTitle = {
        rowCount: 1,
        rows: [{
            count: 1
        }]
    }
    const mockedSearchBooksByTitle = {
        rowCount: 1,
        rows: [{
            'bookid': 1,
            'authorid': 1,
            'title': 'temp',
            'book_type': 'Paper Back',
            'price': 1000,
            'publication_date': '2019-07-03T09:38:35.765Z',
            'available_quantity': 4,
            'book_condition': 'GOOD',
            'isbn': '1903843829489',
            'createdat': '2011-07-03T09:38:35.765Z',
            'description': 'It is a book about a pirate in search of a treasure whick will make him pirate king.',
            'genre_id': 2982,
            'genre_name': 'Anime',
            'author_firstname': 'Chhewang',
            'author_lastname': 'Sherpa',
            'front_img_src': 'http://clodinary/image/234cl23840238909',
            'back_img_src': 'http://clodinary/image/234c29390l238409'
        }]
    }

    const mockedCountBooksByAuthor = {
        rowCount: 1,
        rows: [{
            count: 1
        }]
    }
    const mockedSearchBooksByAuthor = {
        rowCount: 1,
        rows: [{
            'bookid': 1,
            'authorid': 1,
            'title': 'temp',
            'book_type': 'Paper Back',
            'price': 1000,
            'publication_date': '2019-07-03T09:38:35.765Z',
            'available_quantity': 4,
            'book_condition': 'GOOD',
            'isbn': '1903843829489',
            'createdat': '2011-07-03T09:38:35.765Z',
            'description': 'It is a book about a pirate in search of a treasure whick will make him pirate king.',
            'genre_id': 2982,
            'genre_name': 'Anime',
            'author_firstname': 'Chhewang',
            'author_lastname': 'Sherpa',
            'front_img_src': 'http://clodinary/image/234cl23840238909',
            'back_img_src': 'http://clodinary/image/234c29390l238409'
        }]
    }

    const mockedCountBooksByDescription = {
        rowCount: 1,
        rows: [{
            count: 1
        }]
    }
    const mockedSearchBooksByDescription = {
        rowCount: 1,
        rows: [{
            'bookid': 1,
            'authorid': 1,
            'title': 'temp',
            'book_type': 'Paper Back',
            'price': 1000,
            'publication_date': '2019-07-03T09:38:35.765Z',
            'available_quantity': 4,
            'book_condition': 'GOOD',
            'isbn': '1903843829489',
            'createdat': '2011-07-03T09:38:35.765Z',
            'description': 'It is a book about a pirate in search of a treasure whick will make him pirate king.',
            'genre_id': 2982,
            'genre_name': 'Anime',
            'author_firstname': 'Chhewang',
            'author_lastname': 'Sherpa',
            'front_img_src': 'http://clodinary/image/234cl23840238909',
            'back_img_src': 'http://clodinary/image/234c29390l238409'
        }]
    }

    const mockedSortByJson: ISortByToOrderBy = {
        select_by: ', CAST(COUNT(reviews.reviewid) AS integer) AS review_count',
        left_join: 'LEFT JOIN reviews ON books.bookid = reviews.bookid',
        group_by:
          'GROUP BY books.bookid, genres.genre_id, authors.firstname, authors.lastname, reviews.reviewid, front_book_image.img_src, back_book_image.img_src,front_book_image.*, back_book_image.*',
        order_by: 'ORDER BY review_count DESC'
      }

    const mockedPaginationMetadata: IPaginationMetadata = {
        'total_results': 1,
        'total_pages': 1,
        'current_page': 1,
        'has_next_page': false,
        'has_previous_page': false
    }  

    it('Should return success response when searching books by title', async() => {
        jest.resetAllMocks()
        ;(convertToDbOrderBy as jest.Mock).mockReturnValue(mockedSortByJson)
        ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockReturnValue(mockedPaginationMetadata)
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountBooksByTitle)
            .mockResolvedValueOnce(mockedSearchBooksByTitle)

        const result = await SearchBooks(
            searchQuery,
            searchBy,
            searchGenre,
            page,
            size,
            searchSortBy,
            searchBookCondition,
            searchMinPrice,
            searchMaxPrice
        )

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully searched books')
        expect(result.data).toBeDefined()
        expect(result.data.pagination).toBeDefined()
        expect(result.data.pagination).toEqual(mockedPaginationMetadata)
        expect(result.data.results).toBeDefined()
        expect(result.data.results).toEqual(mockedSearchBooksByTitle.rows)
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(convertToDbOrderBy).toHaveBeenCalled()
        expect(generatePaginationMetadata).toHaveBeenCalled()


    })

    it('Should return error response when database fails for searching books by title', async() => {
        jest.resetAllMocks()
        ;(convertToDbOrderBy as jest.Mock).mockReturnValue(mockedSortByJson)
        ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockReturnValue(mockedPaginationMetadata)
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountBooksByTitle)
            .mockRejectedValueOnce(new Error('Database Error'))

        const result = await SearchBooks(
            searchQuery,
            searchBy,
            searchGenre,
            page,
            size,
            searchSortBy,
            searchBookCondition,
            searchMinPrice,
            searchMaxPrice
        )

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to search books')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(convertToDbOrderBy).toHaveBeenCalled()
        expect(generatePaginationMetadata).not.toHaveBeenCalled()
    })

    it('Should return success response when searching books by authors', async() => {
        jest.resetAllMocks()
        ;(convertToDbOrderBy as jest.Mock).mockReturnValue(mockedSortByJson)
        ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockReturnValue(mockedPaginationMetadata)
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountBooksByAuthor)
            .mockResolvedValueOnce(mockedSearchBooksByAuthor)

        const result = await SearchBooks(
            searchQuery,
            searchBy,
            searchGenre,
            page,
            size,
            searchSortBy,
            searchBookCondition,
            searchMinPrice,
            searchMaxPrice
        )

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully searched books')
        expect(result.data).toBeDefined()
        expect(result.data.pagination).toBeDefined()
        expect(result.data.pagination).toEqual(mockedPaginationMetadata)
        expect(result.data.results).toBeDefined()
        expect(result.data.results).toEqual(mockedSearchBooksByTitle.rows)
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(convertToDbOrderBy).toHaveBeenCalled()
        expect(generatePaginationMetadata).toHaveBeenCalled()
    })

    it('Should return error response when database fails for searching books by authors', async() => {
        jest.resetAllMocks()
        ;(convertToDbOrderBy as jest.Mock).mockReturnValue(mockedSortByJson)
        ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockReturnValue(mockedPaginationMetadata)
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountBooksByAuthor)
            .mockRejectedValueOnce(new Error('Database Error'))

        const result = await SearchBooks(
            searchQuery,
            searchBy,
            searchGenre,
            page,
            size,
            searchSortBy,
            searchBookCondition,
            searchMinPrice,
            searchMaxPrice
        )

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to search books')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(convertToDbOrderBy).toHaveBeenCalled()
        expect(generatePaginationMetadata).not.toHaveBeenCalled()
    })

    it('Should return success response when searching books by description', async() => {
        jest.resetAllMocks()
        ;(convertToDbOrderBy as jest.Mock).mockReturnValue(mockedSortByJson)
        ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockReturnValue(mockedPaginationMetadata)
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountBooksByDescription)
            .mockResolvedValueOnce(mockedSearchBooksByDescription)

        const result = await SearchBooks(
            searchQuery,
            searchBy,
            searchGenre,
            page,
            size,
            searchSortBy,
            searchBookCondition,
            searchMinPrice,
            searchMaxPrice
        )

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully searched books')
        expect(result.data).toBeDefined()
        expect(result.data.pagination).toBeDefined()
        expect(result.data.pagination).toEqual(mockedPaginationMetadata)
        expect(result.data.results).toBeDefined()
        expect(result.data.results).toEqual(mockedSearchBooksByTitle.rows)
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(convertToDbOrderBy).toHaveBeenCalled()
        expect(generatePaginationMetadata).toHaveBeenCalled()
    })

    it('Should return error response when database fails for searching books by description', async() => {
        jest.resetAllMocks()
        ;(convertToDbOrderBy as jest.Mock).mockReturnValue(mockedSortByJson)
        ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockReturnValue(mockedPaginationMetadata)
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountBooksByDescription)
            .mockRejectedValueOnce(new Error('Database Error'))

        const result = await SearchBooks(
            searchQuery,
            searchBy,
            searchGenre,
            page,
            size,
            searchSortBy,
            searchBookCondition,
            searchMinPrice,
            searchMaxPrice
        )

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to search books')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(convertToDbOrderBy).toHaveBeenCalled()
        expect(generatePaginationMetadata).not.toHaveBeenCalled()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})