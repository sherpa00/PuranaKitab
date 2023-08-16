import { db } from '../../configs/db.configs'
import generatePaginationMetadata from '../../helpers/generatePaginationMetadata'
import { AddBookGenre, DeleteGenre, GetBookGenres, UpdateGenre } from '../../services/genres.service'
import type { IPaginationMetadata } from '../../types'

jest.mock('../../configs/db.configs.ts', () => ({
    db: {
        query: jest.fn()
    }
}))
jest.mock('../../helpers/generatePaginationMetadata.ts')

describe('Testing get all book genres', () => {
    const page: number = 1
    const size: number = 1

    const mockedCountBookGenresDbQuery = {
        rowCount: 1,
        rows: [{
            count: 1
        }]
    }

    const mockedGetBookGenresDbQuery = {
        rowCount: 1,
        rows: [{
            genre_id: 1,
            genre_name: 'anime'
        }]
    }
    const mockedPaginationMetadata: IPaginationMetadata = {
        total_pages: 1,
        total_results: 1,
        current_page: 1,
        has_next_page: false,
        has_previous_page: false
    }

    it('Should return success response when getting all book genres with pagination', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountBookGenresDbQuery)
            .mockResolvedValueOnce(mockedGetBookGenresDbQuery)
        ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>)
            .mockImplementation(() => mockedPaginationMetadata)

        const result = await GetBookGenres(page,size)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully got all book genres')
        expect(result.data).toBeDefined()
        expect(result.data.pagination).toBeDefined()
        expect(result.data.pagination).toEqual(mockedPaginationMetadata)
        expect(result.data.results).toBeDefined()
        expect(result.data.results).toEqual(mockedGetBookGenresDbQuery.rows)
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(generatePaginationMetadata).toHaveBeenCalled()
    })

    it('Should return success response when getting all book genres without pagination', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountBookGenresDbQuery)
            .mockResolvedValueOnce(mockedGetBookGenresDbQuery)
        ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>)
            .mockImplementation(() => mockedPaginationMetadata)

        const result = await GetBookGenres()

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully got all book genres')
        expect(result.data).toBeDefined()
        expect(result.data.pagination).toBeDefined()
        expect(result.data.pagination).toEqual(mockedPaginationMetadata)
        expect(result.data.results).toBeDefined()
        expect(result.data.results).toEqual(mockedGetBookGenresDbQuery.rows)
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(generatePaginationMetadata).toHaveBeenCalled()
    })

    it('Should return error response when database fails while counting book genres for getting all book genres with pagination', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockRejectedValueOnce(new Error('Database error'))
            .mockResolvedValueOnce(mockedGetBookGenresDbQuery)
        ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>)
            .mockImplementation(() => mockedPaginationMetadata)

        const result = await GetBookGenres(page,size)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to get all book genres')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
        expect(generatePaginationMetadata).not.toHaveBeenCalled()
    })

    it('Should return error response when database fails while getting all book genres with pagination', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountBookGenresDbQuery)
            .mockRejectedValueOnce(new Error('Database error'))
        ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>)
            .mockImplementation(() => mockedPaginationMetadata)

        const result = await GetBookGenres(page,size)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to get all book genres')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
        expect(generatePaginationMetadata).not.toHaveBeenCalled()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})

describe('Testing add new book genres', () => {
    const genreName: string = 'anime'

    const mockedCountBookGenresDbQuery = {
        rowCount: 1,
        rows: [{
            count: 0
        }]
    }

    const mockedAddBookGenresDbQuery = {
        rowCount: 1,
        rows: [{
            genre_id: 1,
            genre_name: genreName
        }]
    }

    it('Should return success response when adding new book genres', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountBookGenresDbQuery)
            .mockResolvedValueOnce(mockedAddBookGenresDbQuery)

        const result = await AddBookGenre(genreName)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully added book genre')
        expect(result.data).toBeDefined()
        expect(result.data).toEqual(mockedAddBookGenresDbQuery.rows[0])
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    it('Should return error response when database fails while counting book genres for adding new book genres', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockRejectedValueOnce(new Error('Database error'))
            .mockResolvedValueOnce(mockedAddBookGenresDbQuery)

        const result = await AddBookGenre(genreName)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to add book genre')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when book genre already exists while counting book genres for adding new book genres', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce({
                rowCount: 1,
                rows: [{
                    count: 1
                }]
            })
            .mockResolvedValueOnce(mockedAddBookGenresDbQuery)

        const result = await AddBookGenre(genreName)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Book genre is already available')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when database fails while adding new book genres', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountBookGenresDbQuery)
            .mockRejectedValueOnce(new Error('Database error'))

        const result = await AddBookGenre(genreName)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to add book genre')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})

describe('Testing update book genres', () => {
    const genreId: number = 1
    const newGenreName: string = 'romance'

    const mockedCountBookGenresDbQuery = {
        rowCount: 1,
        rows: [{
            count: 1
        }]
    }

    const mockedUpdateBookGenresDbQuery = {
        rowCount: 1,
        rows: [{
            genre_id: genreId,
            genre_name: newGenreName
        }]
    }

    it('Should return success response when updating book genres', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountBookGenresDbQuery)
            .mockResolvedValueOnce(mockedUpdateBookGenresDbQuery)

        const result = await UpdateGenre(genreId,newGenreName)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully updated book genre')
        expect(result.data).toBeDefined()
        expect(result.data).toEqual(mockedUpdateBookGenresDbQuery.rows[0])
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    it('Should return error response when database fails while counting book genres for updating book genre', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockRejectedValueOnce(new Error('Database error'))
            .mockResolvedValueOnce(mockedUpdateBookGenresDbQuery)

        const result = await UpdateGenre(genreId,newGenreName)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to update book genre')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when book genre is not available while counting book genres for updating book genre', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce({
                rowCount: 1,
                rows: [{
                    count: 0
                }]
            })
            .mockResolvedValueOnce(mockedUpdateBookGenresDbQuery)

        const result = await UpdateGenre(genreId,newGenreName)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Book genre is not available')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when database fails while updating book genres', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountBookGenresDbQuery)
            .mockRejectedValueOnce(new Error('Database error'))

        const result = await UpdateGenre(genreId,newGenreName)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to update book genre')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})

describe('Testing remove book genres', () => {
    const genreId: number = 1

    const mockedCountBookGenresDbQuery = {
        rowCount: 1,
        rows: [{
            count: 1
        }]
    }

    const mockedRemoveBookGenresDbQuery = {
        rowCount: 1,
        rows: [{
            genre_id: genreId,
            genre_name: 'anime'
        }]
    }

    it('Should return success response when removing book genres', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountBookGenresDbQuery)
            .mockResolvedValueOnce(mockedRemoveBookGenresDbQuery)

        const result = await DeleteGenre(genreId)

        expect(result.success).toBeTruthy()
        expect(result.message).toEqual('Successfully removed book genre')
        expect(result.data).toBeDefined()
        expect(result.data).toEqual(mockedRemoveBookGenresDbQuery.rows[0])
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    it('Should return error response when database fails while counting book genres for removing book genre', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockRejectedValueOnce(new Error('Database error'))
            .mockResolvedValueOnce(mockedRemoveBookGenresDbQuery)

        const result = await DeleteGenre(genreId)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to remove book genre')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when book genre is not available while counting book genres for removing book genre', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce({
                rowCount: 1,
                rows: [{
                    count: 0
                }]
            })
            .mockResolvedValueOnce(mockedRemoveBookGenresDbQuery)

        const result = await DeleteGenre(genreId)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Book genre is not available')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(1)
    })

    it('Should return error response when database fails while removing book genres', async() => {
        jest.resetAllMocks()
        ;(db.query as jest.Mock)
            .mockResolvedValueOnce(mockedCountBookGenresDbQuery)
            .mockRejectedValueOnce(new Error('Database error'))

        const result = await DeleteGenre(genreId)

        expect(result.success).toBeFalsy()
        expect(result.message).toEqual('Failed to remove book genre')
        expect(result.data).toBeUndefined()
        expect(db.query).toHaveBeenCalled()
        expect(db.query).toHaveBeenCalledTimes(2)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
})