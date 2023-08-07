/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '../../configs/db.configs'
import { AddBook, GetAllBooks, GetOnlyOneBook, UpdateBook, type NewBookPayload, RemoveBookWithId, AddBookImg } from '../../services/books.service'
import generatePaginationMetadata from '../../helpers/generatePaginationMetadata'
import { type IPaginationMetadata } from '../../types'
import { type ICloudinaryResponse, removeImageFromCloud, updateImageToCloud, uploadImageToCloud } from '../../utils/cloudinary.utils'

jest.mock('../../configs/db.configs.ts', () => ({
    db: {
        query: jest.fn()
    }
}))
jest.mock('../../helpers/generatePaginationMetadata.ts')
jest.mock('../../utils/cloudinary.utils.ts', () => ({
    uploadImageToCloud: jest.fn(),
    removeImageFromCloud: jest.fn()
}))


describe('Testing get all books service', () => {
    const tempGenre: string = 'genre'
    const tempAuthor: string = 'author'
    const tempPage: number = 1
    const tempSize: number = 1

    const mockedDbQuery = {
        rowCount: 1,
        rows: [{
                'bookid': 1,
                'authorid': 1,
                'title': 'temp book',
                'book_type': 'Paper Back',
                'price': 1000,
                'publication_date': '2019-07-03T09:38:35.765Z',
                'available_quantity': 1,
                'book_condition': 'GOOD',
                'isbn': '1903843829489',
                'createdat': '2011-07-03T09:38:35.765Z',
                'description': 'it is temp book',
                'genre_id': 1,
                'genre_name': 'temp',
                'author_firstname': 'TempAuthorFirst',
                'author_lastname': 'TempAuthorLast',
                'front_img_src': 'http://clodinary/image/234cl23840238909',
                'back_img_src': 'http://clodinary/image/234c29390l238409'
        }]
    }

    const mockedDbQueryCount = {
        rowCount: 1,
        rows: [{
            count: 1
        }]
    }

    const mockedPaginationMetadata: IPaginationMetadata = {
        total_results: 1,
        total_pages: 1,
        current_page: 1,
        has_next_page: false,
        has_previous_page: false
    }

    beforeEach(() => {
        ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockReturnValue(mockedPaginationMetadata)
    })

    it('Should return success response when getting all books without any arguments', async() => {
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbQueryCount)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbQuery)

        const result = await GetAllBooks()

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully got all books')
        expect(result.data).toBeDefined()
        expect(result.data.pagination).toBeDefined()
        expect(result.data.pagination).toEqual(mockedPaginationMetadata)
        expect(result.data.results).toBeDefined()
        expect(result.data.results).toEqual(mockedDbQuery.rows)
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(generatePaginationMetadata).toHaveBeenCalled()
    })

    it('Should return success response when getting all books with all arguments', async() => {
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbQueryCount)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbQuery)

        const result = await GetAllBooks(tempGenre,tempAuthor,tempPage,tempSize)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully got all books')
        expect(result.data).toBeDefined()
        expect(result.data.pagination).toBeDefined()
        expect(result.data.pagination).toEqual(mockedPaginationMetadata)
        expect(result.data.results).toBeDefined()
        expect(result.data.results).toEqual(mockedDbQuery.rows)
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(generatePaginationMetadata).toHaveBeenCalled()
    })

    it('Should return error response when database fails while counting all books without arguments', async() => {
        ;(db.query as jest.Mock).mockRejectedValueOnce(new Error('Database Error'))

        const result = await GetAllBooks()

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to get all books')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
        expect(generatePaginationMetadata).not.toHaveBeenCalled()
    })

    it('Should return error response when database fails while counting all books with arguments', async() => {
        ;(db.query as jest.Mock).mockRejectedValueOnce(new Error('Database Error'))

        const result = await GetAllBooks(tempGenre,tempAuthor,tempPage,tempSize)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to get all books')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
        expect(generatePaginationMetadata).not.toHaveBeenCalled()
    })

    it('Should return error response when database fails while getting all books without arguments', async() => {
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbQueryCount)
        ;(db.query as jest.Mock).mockRejectedValueOnce(new Error('Database Error'))

        const result = await GetAllBooks()

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to get all books')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(generatePaginationMetadata).not.toHaveBeenCalled()
    })

    it('Should return error response when database fails while getting all books with arguments', async() => {
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbQueryCount)
        ;(db.query as jest.Mock).mockRejectedValueOnce(new Error('Database Error'))

        const result = await GetAllBooks(tempGenre,tempAuthor,tempPage,tempSize)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to get all books')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(generatePaginationMetadata).not.toHaveBeenCalled()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})

describe('Testing get single book service', () => {
    const tempBookId: number = 1

    const mockedDbQuery = {
        rowCount: 1,
        rows: [{
                'bookid': 1,
                'authorid': 1,
                'title': 'temp book',
                'book_type': 'Paper Back',
                'price': 1000,
                'publication_date': '2019-07-03T09:38:35.765Z',
                'available_quantity': 1,
                'book_condition': 'GOOD',
                'isbn': '1903843829489',
                'createdat': '2011-07-03T09:38:35.765Z',
                'description': 'it is temp book',
                'genre_id': 1,
                'genre_name': 'temp',
                'author_firstname': 'TempAuthorFirst',
                'author_lastname': 'TempAuthorLast',
                'front_img_src': 'http://clodinary/image/234cl23840238909',
                'back_img_src': 'http://clodinary/image/234c29390l238409'
        }]
    }

    beforeEach(() => {
        ;(db.query as jest.Mock).mockResolvedValue(mockedDbQuery)
    })

    it('Should return success response when getting single book with correct bookid', async() => {
        const result = await GetOnlyOneBook(tempBookId)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully got a book')
        expect(result.data).toBeDefined()
        expect(result.data).toEqual(mockedDbQuery.rows[0])
        expect(db.query).toHaveBeenCalled()
    })

    it('Should return error response when database fails while getting single book with correct bookid', async() => {
        ;(db.query as jest.Mock).mockResolvedValue(new Error('Database Error'))
        const result = await GetOnlyOneBook(tempBookId)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Error while getting a book')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
    })

    it('Should return error response when book is not found while getting single book with incorrect bookid', async() => {
        ;(db.query as jest.Mock).mockResolvedValue({
            rowCount: 0,
            rows: []
        })
        const result = await GetOnlyOneBook(2)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Book is not available')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})

describe('Testing add a book service', () => {
    const tempBookAuthorLastname: string = 'temp_author_lastname'
    const tempBookAuthorFirstname: string = 'temp_author_firstname'
    const tempBookGenreName: string = 'temp_genre_name'
    const tempNewBookPayload: NewBookPayload = {
                'title': 'temp book',
                'book_type': 'Paper Back',
                'price': 1000,
                'publication_date': '2019-07-03T09:38:35.765Z',
                'available_quantity': 1,
                'book_condition': 'GOOD',
                'isbn': '1903843829489',
                'description': 'it is temp book',
                'genre': tempBookGenreName
      }

    const mockedGetAuthorDbQuery = {
        rowCount: 1,
        rows: [{
            authorid: 1
        }]
    }
    const mockedAddAuthorDbQuery = {
        rowCount: 1,
        rows: [{
            authorid: 1
        }]
    }
    const mockedGetGenreDbQuery = {
        rowCount: 1,
        rows: [{
            genre_id: 1
        }]
    }
    const mockedAddGenreDbQuery = {
        rowCount: 1,
        rows: [{
            genre_id: 1
        }]
    }
    const mockedAddBookDbQuery = {
        rowCount: 1,
        rows: [{
                'bookid': 1,
                'title': 'temp book',
                'book_type': 'Paper Back',
                'price': 1000,
                'publication_date': '2019-07-03T09:38:35.765Z',
                'available_quantity': 1,
                'book_condition': 'GOOD',
                'isbn': '1903843829489',
                'createdat': '2011-07-03T09:38:35.765Z',
                'description': 'it is temp book'
        }]
    }

    it('Should return success response when successfully adding new book with correct arguments with already added genre and author', async() => {
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetAuthorDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetGenreDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedAddBookDbQuery)

        const result = await AddBook(tempNewBookPayload, tempBookAuthorFirstname, tempBookAuthorLastname)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully added new book')
        expect(result.data).toBeDefined()
        expect(result.data.title).toEqual(tempNewBookPayload.title)
        expect(result.data.isbn).toEqual(tempNewBookPayload.isbn)
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(3)
    })

    it('Should return success response when successfully adding new book with correct arguments with new genre and author', async() => {
        ;(db.query as jest.Mock).mockResolvedValueOnce({
            rowCount: 0,
            rows: []
        })
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedAddAuthorDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce({
            rowCount: 0,
            rows: []
        })
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedAddGenreDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedAddBookDbQuery)

        const result = await AddBook(tempNewBookPayload, tempBookAuthorFirstname, tempBookAuthorLastname)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully added new book')
        expect(result.data).toBeDefined()
        expect(result.data.title).toEqual(tempNewBookPayload.title)
        expect(result.data.isbn).toEqual(tempNewBookPayload.isbn)
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(5)
    })

    it('Should return error response when database fails while adding new book', async() => {
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetAuthorDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetGenreDbQuery)
        ;(db.query as jest.Mock).mockRejectedValueOnce(new Error('Database Error'))

        const result = await AddBook(tempNewBookPayload, tempBookAuthorFirstname, tempBookAuthorLastname)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed while adding new book')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(3)
    })

    it('Should return error response when database returns empty while adding new book', async() => {
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetAuthorDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetGenreDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce({
            rowCount: 0,
            rows: []
        })

        const result = await AddBook(tempNewBookPayload, tempBookAuthorFirstname, tempBookAuthorLastname)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed while adding new book')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(3)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})

describe('Testing update book service', () => {
    const tempBookId: number = 1

    const mockedDbQuery = {
        rowCount: 1,
        rows: [{
                'bookid': 1,
                'authorid': 1,
                'title': 'New_temp_title',
                'book_type': 'Paper Back',
                'price': 3000,
                'publication_date': '2019-07-03T09:38:35.765Z',
                'available_quantity': 34,
                'book_condition': 'OLD',
                'isbn': '1903843829489',
                'createdat': '2011-07-03T09:38:35.765Z',
                'description': 'it is temp book'
        }]
    }

    it('Should return success response when updating book', async () => {
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbQuery)

        const tempNewBookPayload: Partial<NewBookPayload> = {
                title: 'New_temp_title',
                book_condition: 'OLD',
                price: 3000,
                available_quantity: 34
        }

        const result = await UpdateBook(tempBookId, tempNewBookPayload)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully updated book')
        expect(result.data).toBeDefined()
        expect(result.data.bookid).toEqual(1)
        expect(result.data.title).toEqual(tempNewBookPayload.title)
        expect(result.data.price).toEqual(tempNewBookPayload.price)
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    it('Should return error response when database fails while getting book for updating book', async () => {
        ;(db.query as jest.Mock).mockRejectedValueOnce(new Error('Database Error'))

        const tempNewBookPayload: Partial<NewBookPayload> = {
                title: 'New_temp_title',
                book_condition: 'OLD',
                price: 3000,
                available_quantity: 34
        }

        const result = await UpdateBook(tempBookId, tempNewBookPayload)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to update book')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when book is unavailable for updating book', async () => {
        ;(db.query as jest.Mock).mockResolvedValueOnce({
            rowCount: 0,
            rows: []
        })

        const tempNewBookPayload: Partial<NewBookPayload> = {
                title: 'New_temp_title',
                book_condition: 'OLD',
                price: 3000,
                available_quantity: 34
        }

        const result = await UpdateBook(tempBookId, tempNewBookPayload)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Book is unavailable')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when database fails while updating book', async () => {
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDbQuery)
        ;(db.query as jest.Mock).mockRejectedValue(new Error('Database Error'))

        const tempNewBookPayload: Partial<NewBookPayload> = {
                title: 'New_temp_title',
                book_condition: 'OLD',
                price: 3000,
                available_quantity: 34
        }

        const result = await UpdateBook(tempBookId, tempNewBookPayload)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to update book')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})

describe('Testing delete book service', () => {
    const bookid: number = 1

    const mockedGetBookDbQuery = {
        rowCount: 1,
        rows: [{
            bookid: 1
        }]
    }
    const mockedGetBookImgDbQuery1 = {
        rowCount: 1,
        rows: [{
            img_public_id: 1
        }]
    }
    const mockedDeleteBookImgDbQuery1 = {
        rowCount: 1,
        rows: [{
            book_image_id: 1
        }]
    }
    const mockedGetBookImgDbQuery2 = {
        rowCount: 2,
        rows: [
            {img_public_id: 1},
            {img_public_id: 2}
        ]
    }
    const mockedDeleteBookImgDbQuery2 = {
        rowCount: 2,
        rows: [
            {book_image_id: 1},
            {book_image_id: 2}
        ]
    }
    const mockedGetAndRemoveBookReviewsDbQuery = {
        rowCount: 1,
        rows: [{
            reviewid: 1
        }]
    }
    const mockedGetAndRemoveCartsDbQuery = {
        rowCount: 1,
        rows: [{
            cartid: 1
        }]
    }
    const mockedDeleteBookDbQuery = {
        rowCount: 1,
        rows: [{
            'bookid': 1,
                'authorid': 1,
                'title': 'New_temp_title',
                'book_type': 'Paper Back',
                'price': 3000,
                'publication_date': '2019-07-03T09:38:35.765Z',
                'available_quantity': 34,
                'book_condition': 'OLD',
                'isbn': '1903843829489',
                'createdat': '2011-07-03T09:38:35.765Z',
                'description': 'it is temp book'
        }]
    }
    const mockedRemoveImgFromCloud: ICloudinaryResponse = {
        success: true,
        message: 'Successfully removed image from cloud'
    }

    it('Should return success respose when deleting book with one book front book image', async() => {
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetBookDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetBookImgDbQuery1)
        ;(removeImageFromCloud as jest.Mock).mockResolvedValue(mockedRemoveImgFromCloud)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDeleteBookImgDbQuery1)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetAndRemoveBookReviewsDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetAndRemoveBookReviewsDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetAndRemoveCartsDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetAndRemoveCartsDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDeleteBookDbQuery)

        const result = await RemoveBookWithId(bookid)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully removed book')
        expect(result.data).toBeDefined()
        expect(result.data.bookid).toEqual(bookid)
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(8)
        expect(removeImageFromCloud).toHaveBeenCalled()
        expect(removeImageFromCloud).toHaveBeenCalledTimes(1)
    })

    it('Should return success respose when deleting book with both front and back book image ', async() => {
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetBookDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetBookImgDbQuery2)
        ;(removeImageFromCloud as jest.Mock).mockResolvedValueOnce(mockedRemoveImgFromCloud)
        ;(removeImageFromCloud as jest.Mock).mockResolvedValueOnce(mockedRemoveImgFromCloud)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDeleteBookImgDbQuery2)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetAndRemoveBookReviewsDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetAndRemoveBookReviewsDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetAndRemoveCartsDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetAndRemoveCartsDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDeleteBookDbQuery)

        const result = await RemoveBookWithId(bookid)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully removed book')
        expect(result.data).toBeDefined()
        expect(result.data.bookid).toEqual(bookid)
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(8)
        expect(removeImageFromCloud).toHaveBeenCalled()
        expect(removeImageFromCloud).toHaveBeenCalledTimes(2)
    })

    it('Should return error respose when when database fails while getting books for removing book', async() => {
        ;(db.query as jest.Mock).mockRejectedValue(new Error('Database Error'))

        const result = await RemoveBookWithId(bookid)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to remove book')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
        expect(removeImageFromCloud).not.toHaveBeenCalled()
    })

    it('Should return error respose when when books is unavaiable for removing book', async() => {
        ;(db.query as jest.Mock).mockResolvedValueOnce({
            rowCount: 0,
            rows: []
        })
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetBookImgDbQuery1)
        ;(removeImageFromCloud as jest.Mock).mockResolvedValue(mockedRemoveImgFromCloud)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDeleteBookImgDbQuery1)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetAndRemoveBookReviewsDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetAndRemoveBookReviewsDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetAndRemoveCartsDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetAndRemoveCartsDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedDeleteBookDbQuery)

        const result = await RemoveBookWithId(bookid)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Book is not available')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
        expect(removeImageFromCloud).not.toHaveBeenCalled()
    })

    it('Should return error respose when when cloud remove image fails for removing book', async() => {
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetBookDbQuery)
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetBookImgDbQuery1)
        ;(removeImageFromCloud as jest.Mock).mockResolvedValueOnce({
            success: false,
            message: 'Error while removing image'
        })

        const result = await RemoveBookWithId(bookid)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to remove book')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(removeImageFromCloud).toHaveBeenCalled()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})

describe('Testing add book image service', () => {
    const bookid: number = 1
    const bookImgCover: string = 'FRONT'
    const bookImgPath: string = '/src/public/img.jpg'

    const mockedGetBookDbQuery = {
        rowCount: 1,
        rows: [{
            bookid: 1
        }]
    }
    const mockedGetBookImgDbQuery = {
        rowCount: 0,
        rows: []
    }
    const mockedImgUpload: ICloudinaryResponse = {
        success: true,
        message: 'Successfully uploaded image to cloud'
    }
    const mockedAddBookImgDbQuery = {
        rowCount: 1,
        rows: [{
            img_src: 'https://test/img'
        }]
    }

    beforeEach(() => {
       jest.resetAllMocks()
    })

    it('Should return success response for adding book image', async () => {
        ;(db.query as jest.Mock)
                .mockResolvedValueOnce(mockedGetBookDbQuery)
                .mockResolvedValueOnce(mockedGetBookImgDbQuery)
                .mockResolvedValueOnce(mockedAddBookImgDbQuery)
        ;(uploadImageToCloud as jest.Mock)
            .mockResolvedValue(mockedImgUpload)

        const result = await AddBookImg(bookid, bookImgPath, bookImgCover)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully uploaded book image')
        expect(result.data).toBeDefined()
        expect(result.data.src).toBeDefined()
        expect(result.data.src).toEqual(mockedAddBookImgDbQuery.rows[0].img_src)
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(3)
        expect(uploadImageToCloud).toHaveBeenCalled()
    })

    it('Should return error response when database fails while getting book for adding book image', async () => {
        ;(db.query as jest.Mock)
                .mockRejectedValue(new Error('Dadtabase Error'))
        ;(uploadImageToCloud as jest.Mock)
            .mockResolvedValue(mockedImgUpload)

        const result = await AddBookImg(bookid, bookImgPath, bookImgCover)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to upload book image')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
        expect(uploadImageToCloud).not.toHaveBeenCalled()
    })

    it('Should return error response when books is unavailable adding book image', async () => {
        ;(db.query as jest.Mock)
                .mockResolvedValue({rowCount: 0, rows: []})
        ;(uploadImageToCloud as jest.Mock)
            .mockResolvedValue(mockedImgUpload)

        const result = await AddBookImg(bookid, bookImgPath, bookImgCover)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Book is not available')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
        expect(uploadImageToCloud).not.toHaveBeenCalled()
    })

    it('Should return error response when database fails when getting book image for adding book image', async () => {
        ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetBookDbQuery)
        ;(db.query as jest.Mock).mockRejectedValue(new Error('Database Error'))

        ;(uploadImageToCloud as jest.Mock)
            .mockResolvedValue(mockedImgUpload)

        const result = await AddBookImg(bookid, bookImgPath, bookImgCover)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to upload book image')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(uploadImageToCloud).not.toHaveBeenCalled()
    })

    it('Should return error response when book image already available for adding book image', async () => {
        ;(db.query as jest.Mock)
                .mockResolvedValueOnce(mockedGetBookDbQuery)
                .mockResolvedValue({rowCount: 1, rows: [{book_image_id: 1}]})

        ;(uploadImageToCloud as jest.Mock)
            .mockResolvedValue(mockedImgUpload)

        const result = await AddBookImg(bookid, bookImgPath, bookImgCover)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Book Image of ' + bookImgCover +' cover already exists')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(uploadImageToCloud).not.toHaveBeenCalled()
    })

    it('Should return error response when cloud upload booki image fails for adding book image', async () => {
        ;(db.query as jest.Mock)
                .mockResolvedValueOnce(mockedGetBookDbQuery)
                .mockResolvedValueOnce(mockedGetBookImgDbQuery)
                .mockResolvedValueOnce(mockedAddBookImgDbQuery)
        ;(uploadImageToCloud as jest.Mock)
            .mockResolvedValue({
                success: false,
                message: 'Failed to upload image'
            })

        const result = await AddBookImg(bookid, bookImgPath, bookImgCover)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to upload book image')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(uploadImageToCloud).toHaveBeenCalled()
    })

    it('Should return error response when database fails adding book image', async () => {
        ;(db.query as jest.Mock)
                .mockResolvedValueOnce(mockedGetBookDbQuery)
                .mockResolvedValueOnce(mockedGetBookImgDbQuery)
                .mockRejectedValue(new Error('Database Error'))

        ;(uploadImageToCloud as jest.Mock)
            .mockResolvedValue(mockedImgUpload)

        const result = await AddBookImg(bookid, bookImgPath, bookImgCover)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to upload book image')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(3)
        expect(uploadImageToCloud).toHaveBeenCalled()
    })
    
    afterEach(() => {
        jest.clearAllMocks()
    })
})