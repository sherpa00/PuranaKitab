import { db } from '../../configs/db.configs'
import { AddReview, GetAllReviews, RemoveAllReviews, RemoveSinlgeReview } from '../../services/reviews.service'

jest.mock('../../configs/db.configs.ts', () => ({
  db: {
    query: jest.fn()
  }
}))

describe('Testing get all book reivews service', () => {
  const bookID: number = 1

  const mockedGetBookDbQuery = {
    rowCount: 1,
    rows: [
      {
        bookid: bookID
      }
    ]
  }
  const mockedGetReviewsDbQuery = {
    rowCount: 1,
    rows: [
      {
        reviewid: 1,
        userid: 1,
        bookid: bookID,
        username: 'jhon doe',
        stars: 1,
        message: 'Nice Book'
      }
    ]
  }

  beforeEach(() => {
    ;(db.query as jest.Mock).mockResolvedValueOnce(mockedGetBookDbQuery).mockResolvedValueOnce(mockedGetReviewsDbQuery)
  })

  it('Should get successfull response while getting all book reviews', async () => {
    const result = await GetAllReviews(bookID)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully got all book reviews')
    expect(result.data).toBeDefined()
    expect(result.data).toEqual(mockedGetReviewsDbQuery.rows)
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  it('Should get error response when database fails while getting books for getting all book reviews', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockRejectedValueOnce(new Error('Database Error'))
      .mockResolvedValueOnce(mockedGetReviewsDbQuery)

    const result = await GetAllReviews(bookID)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to get all book reviews')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should get error response when book is not found for getting all book reviews', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce({
        rowCount: 0,
        rows: []
      })
      .mockResolvedValueOnce(mockedGetReviewsDbQuery)

    const result = await GetAllReviews(bookID)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('No Book Found')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should get error response when database fails while getting all book reviews', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetBookDbQuery)
      .mockRejectedValueOnce(new Error('Database Error'))

    const result = await GetAllReviews(bookID)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to get all book reviews')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

describe('Testing add book review service', () => {
  const bookID: number = 1
  const userID: number = 1
  const userName: string = 'Jhon Doe'
  const reviewStars: number = 1
  const reviewMessage: string = 'Nice Book'

  const mockedGetBookDbQuery = {
    rowCount: 1,
    rows: [
      {
        bookid: bookID
      }
    ]
  }
  const mockedGetReviewsDbQuery = {
    rowCount: 0,
    rows: []
  }
  const mockedAddReviewDbQuery = {
    rowCount: 1,
    rows: [
      {
        reviewid: 1,
        userid: userID,
        bookid: bookID,
        username: userName,
        stars: reviewStars,
        message: reviewMessage
      }
    ]
  }

  beforeEach(() => {
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetBookDbQuery)
      .mockResolvedValueOnce(mockedGetReviewsDbQuery)
      .mockResolvedValueOnce(mockedAddReviewDbQuery)
  })

  it('Should return success response while adding book review', async () => {
    const result = await AddReview(userID, bookID, userName, reviewStars, reviewMessage)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully added book review')
    expect(result.data).toBeDefined()
    expect(result.data).toEqual(mockedAddReviewDbQuery.rows[0])
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(3)
  })

  it('Should get error response when database fails while getting books for adding book reviews', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockRejectedValueOnce(new Error('Database Error'))
      .mockResolvedValueOnce(mockedGetReviewsDbQuery)
      .mockResolvedValueOnce(mockedAddReviewDbQuery)

    const result = await AddReview(userID, bookID, userName, reviewStars, reviewMessage)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to add book review')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should get error response when book is not found for adding book review', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce({
        rowCount: 0,
        rows: []
      })
      .mockResolvedValueOnce(mockedGetReviewsDbQuery)
      .mockResolvedValueOnce(mockedAddReviewDbQuery)

    const result = await AddReview(userID, bookID, userName, reviewStars, reviewMessage)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('No Book Found')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should get error response when book is reviewd already for adding book review', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetBookDbQuery)
      .mockResolvedValueOnce({
        rowCount: 1,
        rows: [
          {
            bookid: bookID
          }
        ]
      })
      .mockResolvedValueOnce(mockedAddReviewDbQuery)

    const result = await AddReview(userID, bookID, userName, reviewStars, reviewMessage)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Already reviewed book')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  it('Should get error response when database fails while adding book review', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetBookDbQuery)
      .mockResolvedValueOnce(mockedGetReviewsDbQuery)
      .mockRejectedValueOnce(new Error('Database Error'))

    const result = await AddReview(userID, bookID, userName, reviewStars, reviewMessage)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to add book review')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(3)
  })

  it('Should get error response when review stars is greater than 5 while adding book review', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetBookDbQuery)
      .mockResolvedValueOnce(mockedGetReviewsDbQuery)
      .mockRejectedValueOnce(new Error('Database Error'))

    const result = await AddReview(userID, bookID, userName, 10, reviewMessage)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to add book review')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(3)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

describe('Testing remove single book reivew service', () => {
  const reviewID: number = 1

  const mockedGetReviewsDbQuery = {
    rowCount: 1,
    rows: [
      {
        reviewid: reviewID
      }
    ]
  }
  const mockedRemoveReviewsDbQuery = {
    rowCount: 1,
    rows: [
      {
        reviewid: reviewID,
        userid: 1,
        bookid: 1,
        username: 'jhon doe',
        stars: 1,
        message: 'Nice Book'
      }
    ]
  }

  beforeEach(() => {
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetReviewsDbQuery)
      .mockResolvedValueOnce(mockedRemoveReviewsDbQuery)
  })

  it('Should get successfull response while removing single book review', async () => {
    const result = await RemoveSinlgeReview(reviewID)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully removed book review')
    expect(result.data).toBeDefined()
    expect(result.data).toEqual(mockedRemoveReviewsDbQuery.rows[0])
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  it('Should get error response when database fails while getting reviews for removing single book review', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockRejectedValueOnce(new Error('Database Error'))
      .mockResolvedValueOnce(mockedRemoveReviewsDbQuery)

    const result = await RemoveSinlgeReview(reviewID)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to remove book review')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should get error response when book review is not found for removing single book review', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce({
        rowCount: 0,
        rows: []
      })
      .mockResolvedValueOnce(mockedRemoveReviewsDbQuery)

    const result = await RemoveSinlgeReview(reviewID)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('No book review found')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should get error response when database fails while removing single book review', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetReviewsDbQuery)
      .mockRejectedValueOnce(new Error('Database Error'))

    const result = await RemoveSinlgeReview(reviewID)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to remove book review')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

describe('Testing remove single book review service', () => {
  const reviewID: number = 1

  const mockedGetReviewsDbQuery = {
    rowCount: 1,
    rows: [
      {
        reviewid: reviewID
      }
    ]
  }
  const mockedRemoveReviewsDbQuery = {
    rowCount: 1,
    rows: [
      {
        reviewid: reviewID,
        userid: 1,
        bookid: 1,
        username: 'jhon doe',
        stars: 1,
        message: 'Nice Book'
      }
    ]
  }

  beforeEach(() => {
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetReviewsDbQuery)
      .mockResolvedValueOnce(mockedRemoveReviewsDbQuery)
  })

  it('Should get successfull response while removing single book review', async () => {
    const result = await RemoveSinlgeReview(reviewID)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully removed book review')
    expect(result.data).toBeDefined()
    expect(result.data).toEqual(mockedRemoveReviewsDbQuery.rows[0])
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  it('Should get error response when database fails while getting reviews for removing single book review', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockRejectedValueOnce(new Error('Database Error'))
      .mockResolvedValueOnce(mockedRemoveReviewsDbQuery)

    const result = await RemoveSinlgeReview(reviewID)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to remove book review')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should get error response when book review is not found for removing single book review', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce({
        rowCount: 0,
        rows: []
      })
      .mockResolvedValueOnce(mockedRemoveReviewsDbQuery)

    const result = await RemoveSinlgeReview(reviewID)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('No book review found')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should get error response when database fails while removing single book review', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetReviewsDbQuery)
      .mockRejectedValueOnce(new Error('Database Error'))

    const result = await RemoveSinlgeReview(reviewID)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to remove book review')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})

describe('Testing remove all book reviews service', () => {
  const bookID: number = 1

  const mockedGetBookDbQuery = {
    rowCount: 1,
    rows: [
      {
        bookid: bookID
      }
    ]
  }
  const mockedRemoveReviewsDbQuery = {
    rowCount: 1,
    rows: [
      {
        reviewid: 1,
        userid: 1,
        bookid: bookID,
        username: 'jhon doe',
        stars: 1,
        message: 'Nice Book'
      }
    ]
  }

  beforeEach(() => {
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetBookDbQuery)
      .mockResolvedValueOnce(mockedRemoveReviewsDbQuery)
  })

  it('Should get successfull response while removing all book reviews', async () => {
    const result = await RemoveAllReviews(bookID)

    expect(result.success).toBeTruthy()
    expect(result.message).toEqual('Successfully removed all book reviews')
    expect(result.data).toBeDefined()
    expect(result.data).toEqual(mockedRemoveReviewsDbQuery.rows)
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  it('Should get error response when database fails while getting books for removing all book reviews', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockRejectedValueOnce(new Error('Database Error'))
      .mockResolvedValueOnce(mockedRemoveReviewsDbQuery)

    const result = await RemoveAllReviews(bookID)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to remove all book reviews')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should get error response when book is not found for removing all book reviews', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce({
        rowCount: 0,
        rows: []
      })
      .mockResolvedValueOnce(mockedRemoveReviewsDbQuery)

    const result = await RemoveAllReviews(bookID)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('No Book Found')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  it('Should get error response when database fails while removing all book reviews', async () => {
    jest.resetAllMocks()
    ;(db.query as jest.Mock)
      .mockResolvedValueOnce(mockedGetBookDbQuery)
      .mockRejectedValueOnce(new Error('Database Error'))

    const result = await RemoveAllReviews(bookID)

    expect(result.success).toBeFalsy()
    expect(result.message).toEqual('Failed to remove all book reviews')
    expect(result.data).toBeUndefined()
    expect(db.query).toHaveBeenCalled()
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
