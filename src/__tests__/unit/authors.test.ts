import { db } from '../../configs/db.configs'
import generatePaginationMetadata from '../../helpers/generatePaginationMetadata'
import { AddNewBookAuthor, GetAllBookAuthors, RemoveAuthor, UpdateAuthor } from '../../services/authors.service'
import type { IPaginationMetadata } from '../../types'

jest.mock('../../configs/db.configs.ts', () => ({
  db: {
    query: jest.fn()
  }
}))
jest.mock('../../helpers/generatePaginationMetadata.ts')

describe('Testing get all book authors service', () => {
  const page: number = 1
  const size: number = 1

  const mockedCountAllAuthorsDbQuery = {
    rowCount: 1,
    rows: [
      {
        count: 1
      }
    ]
  }
  const mockedGetAllAuthorsDbQuery = {
    rowCount: 1,
    rows: [
      {
        authorid: 1,
        firstname: 'Leo',
        lastname: 'Wang',
        fullname: 'Leo Wang'
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

  it('Should return successfull response while getting all book authors with pagination', async () => {
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedCountAllAuthorsDbQuery)
      .mockResolvedValueOnce(mockedGetAllAuthorsDbQuery)
    ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockImplementation(
      () => mockedPaginationMetadata
    )

    const result = await GetAllBookAuthors(page, size)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully got all book authors')
    expect(result.data).toBeDefined()
    expect(result.data.pagination).toBeDefined()
    expect(result.data.pagination).toEqual(mockedPaginationMetadata)
    expect(result.data.results).toEqual(mockedGetAllAuthorsDbQuery.rows)
    expect(db.query).toHaveBeenCalledTimes(2)
    expect(generatePaginationMetadata).toHaveBeenCalled()
  })

  it('Should return successfull response while getting all book authors without pagination', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedCountAllAuthorsDbQuery)
      .mockResolvedValueOnce(mockedGetAllAuthorsDbQuery)
    ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockImplementation(
      () => mockedPaginationMetadata
    )

    const result = await GetAllBookAuthors()

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully got all book authors')
    expect(result.data).toBeDefined()
    expect(result.data.pagination).toBeDefined()
    expect(result.data.pagination).toEqual(mockedPaginationMetadata)
    expect(result.data.results).toEqual(mockedGetAllAuthorsDbQuery.rows)
    expect(db.query).toHaveBeenCalledTimes(2)
    expect(generatePaginationMetadata).toHaveBeenCalled()
  })

  it('Should return error response when database fails while counting book authors for getting all book authors', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockRejectedValueOnce(new Error('Database Error'))
      .mockResolvedValueOnce(mockedGetAllAuthorsDbQuery)
    ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockImplementation(
      () => mockedPaginationMetadata
    )

    const result = await GetAllBookAuthors(page, size)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to get all book authors')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(1)
    expect(generatePaginationMetadata).not.toHaveBeenCalled()
  })

  it('Should return error response when database fails while getting all book authors', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedCountAllAuthorsDbQuery)
      .mockRejectedValueOnce(new Error('Database Error'))
    ;(generatePaginationMetadata as jest.MockedFunction<typeof generatePaginationMetadata>).mockImplementation(
      () => mockedPaginationMetadata
    )

    const result = await GetAllBookAuthors(page, size)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to get all book authors')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(2)
    expect(generatePaginationMetadata).not.toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

describe('Testing add new book author service', () => {
  const firstname: string = 'Leo'
  const lastname: string = 'Wang'

  const mockedGetAuthorsDbQuery = {
    rowCount: 1,
    rows: [
      {
        count: 0
      }
    ]
  }
  const mockedAddAuthorsDbQuery = {
    rowCount: 1,
    rows: [
      {
        authorid: 1,
        firstname,
        lastname
      }
    ]
  }

  it('Should return successfull response while adding new book author', async () => {
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetAuthorsDbQuery)
      .mockResolvedValueOnce(mockedAddAuthorsDbQuery)

    const result = await AddNewBookAuthor(firstname, lastname)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully added new book author')
    expect(result.data).toBeDefined()
    expect(result.data).toEqual(mockedAddAuthorsDbQuery.rows[0])
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  it('Should return error response when database fails while getting book authors for adding new book author', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockRejectedValueOnce(new Error('Database Error'))
      .mockResolvedValueOnce(mockedAddAuthorsDbQuery)

    const result = await AddNewBookAuthor(firstname, lastname)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to add new book author')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should return error response when book author already exists while adding new book author', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce({
        rowCount: 1,
        rows: [
          {
            count: 1
          }
        ]
      })
      .mockResolvedValueOnce(mockedAddAuthorsDbQuery)

    const result = await AddNewBookAuthor(firstname, lastname)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Book Author already exists')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should return error response when database fails while adding new book author', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetAuthorsDbQuery)
      .mockRejectedValueOnce(new Error('Database Error'))

    const result = await AddNewBookAuthor(firstname, lastname)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to add new book author')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

describe('Testing update book author service', () => {
  const authorid: number = 1
  const firstname: string = 'NewLeo'
  const lastname: string = 'NewWang'

  const mockedGetAuthorsDbQuery = {
    rowCount: 1,
    rows: [
      {
        authorid,
        firstname: 'OldLeo',
        lastname: 'OldWang'
      }
    ]
  }
  const mockedUpdateAuthorsDbQuery = {
    rowCount: 1,
    rows: [
      {
        authorid: 1,
        firstname,
        lastname
      }
    ]
  }

  it('Should return successfull response while updating book author', async () => {
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetAuthorsDbQuery)
      .mockResolvedValueOnce(mockedUpdateAuthorsDbQuery)

    const result = await UpdateAuthor(authorid, firstname, lastname)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully updated book author')
    expect(result.data).toBeDefined()
    expect(result.data).toEqual(mockedUpdateAuthorsDbQuery.rows[0])
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  it('Should return error response when database fails while getting book authors for updating book author', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockRejectedValueOnce(new Error('Database Error'))
      .mockResolvedValueOnce(mockedUpdateAuthorsDbQuery)

    const result = await UpdateAuthor(authorid, firstname, lastname)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to update book author')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should return error response when book author is unavailable while updating book author', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce({
        rowCount: 0,
        rows: []
      })
      .mockResolvedValueOnce(mockedUpdateAuthorsDbQuery)

    const result = await UpdateAuthor(authorid, firstname, lastname)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Book Author is not available')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should return error response when database fails while updating book author', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetAuthorsDbQuery)
      .mockRejectedValueOnce(new Error('Database Error'))

    const result = await UpdateAuthor(authorid, firstname, lastname)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to update book author')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

describe('Testing remove book author service', () => {
  const authorid: number = 1

  const mockedGetAuthorsDbQuery = {
    rowCount: 1,
    rows: [
      {
        count: 1
      }
    ]
  }
  const mockedRemoveAuthorsDbQuery = {
    rowCount: 1,
    rows: [
      {
        authorid: 1,
        firstname: 'Leo',
        lastname: 'Wang'
      }
    ]
  }

  it('Should return successfull response while removing book author', async () => {
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetAuthorsDbQuery)
      .mockResolvedValueOnce(mockedRemoveAuthorsDbQuery)

    const result = await RemoveAuthor(authorid)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully removed book author')
    expect(result.data).toBeDefined()
    expect(result.data).toEqual(mockedRemoveAuthorsDbQuery.rows[0])
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  it('Should return error response when database fails while counting book authors for removing book author', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockRejectedValueOnce(new Error('Database Error'))
      .mockResolvedValueOnce(mockedRemoveAuthorsDbQuery)

    const result = await RemoveAuthor(authorid)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to remove book author')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should return error response when book author is unavailable while removing book author', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce({
        rowCount: 1,
        rows: [
          {
            count: 0
          }
        ]
      })
      .mockResolvedValueOnce(mockedRemoveAuthorsDbQuery)

    const result = await RemoveAuthor(authorid)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Book Author is not available')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should return error response when database fails while removing book author', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetAuthorsDbQuery)
      .mockRejectedValueOnce(new Error('Database Error'))

    const result = await RemoveAuthor(authorid)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to remove book author')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
