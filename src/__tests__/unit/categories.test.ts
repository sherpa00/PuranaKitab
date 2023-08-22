import { db } from '../../configs/db.configs'
import generatePaginationMetadata from '../../helpers/generatePaginationMetadata'
import {
  GetCategoriesBestSeller,
  GetCategoriesNewArrivals,
  GetCategoriesRecentlyAdded,
  GetCategoriesTopRated
} from '../../services/categories.service'
import type { IPaginationMetadata } from '../../types'

jest.mock('../../configs/db.configs.ts', () => ({
  db: {
    query: jest.fn()
  }
}))
jest.mock('../../helpers/generatePaginationMetadata.ts')

describe('Testing get categories best seller books', () => {
  const page: number = 1
  const size: number = 1

  const mockedCountBooksDbQuery = {
    rowCount: 1,
    rows: [
      {
        count: 1
      }
    ]
  }
  const mockedGetBooksDbQuery = {
    rowCount: 1,
    rows: [
      {
        bookid: 125,
        authorid: 122348,
        title: 'One Piece',
        book_type: 'Paper Back',
        price: 1000,
        publication_date: '2019-07-03T09:38:35.765Z',
        available_quantity: 4,
        book_condition: 'GOOD',
        isbn: '1903843829489',
        createdat: '2011-07-03T09:38:35.765Z',
        description: 'It is a book about a pirate in search of a treasure whick will make him pirate king.',
        genre_id: 2982,
        genre_name: 'Anime',
        author_firstname: 'Chhewang',
        author_lastname: 'Sherpa',
        front_img_src: 'http://clodinary/image/234cl23840238909',
        back_img_src: 'http://clodinary/image/234c29390l238409'
      }
    ]
  }
  const mockedPaginationMetadata: IPaginationMetadata = {
    total_pages: 1,
    total_results: 1,
    current_page: 1,
    has_next_page: false,
    has_previous_page: false
  }

  it('Should return success response when getting categories best seller books with pagination', async () => {
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedCountBooksDbQuery).mockResolvedValueOnce(mockedGetBooksDbQuery)
    ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockImplementation(
      () => mockedPaginationMetadata
    )

    const result = await GetCategoriesBestSeller(page, size)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully got the best seller category')
    expect(result.data).toBeDefined()
    expect(result.data.pagination).toEqual(mockedPaginationMetadata)
    expect(result.data.results).toEqual(mockedGetBooksDbQuery.rows)
    expect(db.query).toHaveBeenCalledTimes(2)
    expect(generatePaginationMetadata).toHaveBeenCalled()
  })

  it('Should return error response when database fails while getting categories best seller books', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedCountBooksDbQuery)
      .mockRejectedValueOnce(new Error('Database Error'))
    ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockImplementation(
      () => mockedPaginationMetadata
    )

    const result = await GetCategoriesBestSeller(page, size)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to get the best seller category')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(2)
    expect(generatePaginationMetadata).not.toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

describe('Testing get categories top rated books', () => {
  const page: number = 1
  const size: number = 1

  const mockedCountBooksDbQuery = {
    rowCount: 1,
    rows: [
      {
        count: 1
      }
    ]
  }
  const mockedGetBooksDbQuery = {
    rowCount: 1,
    rows: [
      {
        bookid: 125,
        authorid: 122348,
        title: 'One Piece',
        book_type: 'Paper Back',
        price: 1000,
        publication_date: '2019-07-03T09:38:35.765Z',
        available_quantity: 4,
        book_condition: 'GOOD',
        isbn: '1903843829489',
        createdat: '2011-07-03T09:38:35.765Z',
        description: 'It is a book about a pirate in search of a treasure whick will make him pirate king.',
        genre_id: 2982,
        genre_name: 'Anime',
        author_firstname: 'Chhewang',
        author_lastname: 'Sherpa',
        front_img_src: 'http://clodinary/image/234cl23840238909',
        back_img_src: 'http://clodinary/image/234c29390l238409'
      }
    ]
  }
  const mockedPaginationMetadata: IPaginationMetadata = {
    total_pages: 1,
    total_results: 1,
    current_page: 1,
    has_next_page: false,
    has_previous_page: false
  }

  it('Should return success response when getting categories top rated books with pagination', async () => {
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedCountBooksDbQuery).mockResolvedValueOnce(mockedGetBooksDbQuery)
    ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockImplementation(
      () => mockedPaginationMetadata
    )

    const result = await GetCategoriesTopRated(page, size)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully got the top rated category')
    expect(result.data).toBeDefined()
    expect(result.data.pagination).toEqual(mockedPaginationMetadata)
    expect(result.data.results).toEqual(mockedGetBooksDbQuery.rows)
    expect(db.query).toHaveBeenCalledTimes(2)
    expect(generatePaginationMetadata).toHaveBeenCalled()
  })

  it('Should return error response when database fails while getting categories top rated books', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedCountBooksDbQuery)
      .mockRejectedValueOnce(new Error('Database Error'))
    ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockImplementation(
      () => mockedPaginationMetadata
    )

    const result = await GetCategoriesTopRated(page, size)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to get the top rated category')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(2)
    expect(generatePaginationMetadata).not.toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

describe('Testing get categories new arrivals books', () => {
  const page: number = 1
  const size: number = 1

  const mockedCountBooksDbQuery = {
    rowCount: 1,
    rows: [
      {
        count: 1
      }
    ]
  }
  const mockedGetBooksDbQuery = {
    rowCount: 1,
    rows: [
      {
        bookid: 125,
        authorid: 122348,
        title: 'One Piece',
        book_type: 'Paper Back',
        price: 1000,
        publication_date: '2019-07-03T09:38:35.765Z',
        available_quantity: 4,
        book_condition: 'GOOD',
        isbn: '1903843829489',
        createdat: '2011-07-03T09:38:35.765Z',
        description: 'It is a book about a pirate in search of a treasure whick will make him pirate king.',
        genre_id: 2982,
        genre_name: 'Anime',
        author_firstname: 'Chhewang',
        author_lastname: 'Sherpa',
        front_img_src: 'http://clodinary/image/234cl23840238909',
        back_img_src: 'http://clodinary/image/234c29390l238409'
      }
    ]
  }
  const mockedPaginationMetadata: IPaginationMetadata = {
    total_pages: 1,
    total_results: 1,
    current_page: 1,
    has_next_page: false,
    has_previous_page: false
  }

  it('Should return success response when getting categories new arrivals books with pagination', async () => {
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedCountBooksDbQuery).mockResolvedValueOnce(mockedGetBooksDbQuery)
    ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockImplementation(
      () => mockedPaginationMetadata
    )

    const result = await GetCategoriesNewArrivals(page, size)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully got the new arrivals category')
    expect(result.data).toBeDefined()
    expect(result.data.pagination).toEqual(mockedPaginationMetadata)
    expect(result.data.results).toEqual(mockedGetBooksDbQuery.rows)
    expect(db.query).toHaveBeenCalledTimes(2)
    expect(generatePaginationMetadata).toHaveBeenCalled()
  })

  it('Should return error response when database fails while getting categories new arrivals books', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedCountBooksDbQuery)
      .mockRejectedValueOnce(new Error('Database Error'))
    ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockImplementation(
      () => mockedPaginationMetadata
    )

    const result = await GetCategoriesNewArrivals(page, size)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to get new arrivals category')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(2)
    expect(generatePaginationMetadata).not.toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

describe('Testing get categories recently added books', () => {
  const page: number = 1
  const size: number = 1

  const mockedCountBooksDbQuery = {
    rowCount: 1,
    rows: [
      {
        count: 1
      }
    ]
  }
  const mockedGetBooksDbQuery = {
    rowCount: 1,
    rows: [
      {
        bookid: 125,
        authorid: 122348,
        title: 'One Piece',
        book_type: 'Paper Back',
        price: 1000,
        publication_date: '2019-07-03T09:38:35.765Z',
        available_quantity: 4,
        book_condition: 'GOOD',
        isbn: '1903843829489',
        createdat: '2011-07-03T09:38:35.765Z',
        description: 'It is a book about a pirate in search of a treasure whick will make him pirate king.',
        genre_id: 2982,
        genre_name: 'Anime',
        author_firstname: 'Chhewang',
        author_lastname: 'Sherpa',
        front_img_src: 'http://clodinary/image/234cl23840238909',
        back_img_src: 'http://clodinary/image/234c29390l238409'
      }
    ]
  }
  const mockedPaginationMetadata: IPaginationMetadata = {
    total_pages: 1,
    total_results: 1,
    current_page: 1,
    has_next_page: false,
    has_previous_page: false
  }

  it('Should return success response when getting categories recently added books with pagination', async () => {
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedCountBooksDbQuery).mockResolvedValueOnce(mockedGetBooksDbQuery)
    ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockImplementation(
      () => mockedPaginationMetadata
    )

    const result = await GetCategoriesRecentlyAdded(page, size)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully got the recently added category')
    expect(result.data).toBeDefined()
    expect(result.data.pagination).toEqual(mockedPaginationMetadata)
    expect(result.data.results).toEqual(mockedGetBooksDbQuery.rows)
    expect(db.query).toHaveBeenCalledTimes(2)
    expect(generatePaginationMetadata).toHaveBeenCalled()
  })

  it('Should return error response when database fails while getting categories recently added books', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedCountBooksDbQuery)
      .mockRejectedValueOnce(new Error('Database Error'))
    ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockImplementation(
      () => mockedPaginationMetadata
    )

    const result = await GetCategoriesRecentlyAdded(page, size)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to get recently added category')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(2)
    expect(generatePaginationMetadata).not.toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
