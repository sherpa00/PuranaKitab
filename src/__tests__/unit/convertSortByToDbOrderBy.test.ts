import { type ISortByToOrderBy, convertToDbOrderBy } from '../../helpers/convertSortByToDbOrderBy'

describe('Testing helper function to convert sort by to db order by json', () => {
  it('Should return correct order by json for most reviewed', () => {
    const sortBy: string = 'most_reviewed'
    const expectedResult: ISortByToOrderBy = {
      select_by: ', CAST(COUNT(reviews.reviewid) AS integer) AS review_count',
      left_join: 'LEFT JOIN reviews ON books.bookid = reviews.bookid',
      group_by:
        'GROUP BY books.bookid, genres.genre_id, authors.firstname, authors.lastname, reviews.reviewid, front_book_image.img_src, back_book_image.img_src,front_book_image.*, back_book_image.*',
      order_by: 'ORDER BY review_count DESC'
    }

    const result = convertToDbOrderBy(sortBy)

    expect(result).toBeDefined()
    expect(result).toEqual(expectedResult)
  })

  it('Should return correct order by json for least reviewed', () => {
    const sortBy: string = 'least_reviewed'
    const expectedResult: ISortByToOrderBy = {
      select_by: ', CAST(COUNT(reviews.reviewid) AS integer) AS review_count',
      left_join: 'LEFT JOIN reviews ON books.bookid = reviews.bookid',
      group_by:
        'GROUP BY books.bookid,genres.genre_id, authors.firstname, authors.lastname, reviews.reviewid, front_book_image.img_src, back_book_image.img_src,front_book_image.*, back_book_image.*',
      order_by: 'ORDER BY review_count ASC'
    }

    const result = convertToDbOrderBy(sortBy)

    expect(result).toBeDefined()
    expect(result).toEqual(expectedResult)
  })

  it('Should return correct order by json for alphabetically ascending order', () => {
    const sortBy: string = 'alphabetically_asc'
    const expectedResult: ISortByToOrderBy = {
      select_by: '',
      left_join: '',
      group_by: '',
      order_by: 'ORDER BY books.title ASC'
    }

    const result = convertToDbOrderBy(sortBy)

    expect(result).toBeDefined()
    expect(result).toEqual(expectedResult)
  })

  it('Should return correct order by json for alphabetically descending order', () => {
    const sortBy: string = 'alphabetically_desc'
    const expectedResult: ISortByToOrderBy = {
      select_by: '',
      left_join: '',
      group_by: '',
      order_by: 'ORDER BY books.title DESC'
    }

    const result = convertToDbOrderBy(sortBy)

    expect(result).toBeDefined()
    expect(result).toEqual(expectedResult)
  })

  it('Should return correct order by json for book price high', () => {
    const sortBy: string = 'price_high'
    const expectedResult: ISortByToOrderBy = {
      select_by: '',
      left_join: '',
      group_by: '',
      order_by: 'ORDER BY books.price DESC'
    }

    const result = convertToDbOrderBy(sortBy)

    expect(result).toBeDefined()
    expect(result).toEqual(expectedResult)
  })

  it('Should return correct order by json for book price high', () => {
    const sortBy: string = 'price_low'
    const expectedResult: ISortByToOrderBy = {
      select_by: '',
      left_join: '',
      group_by: '',
      order_by: 'ORDER BY books.price ASC'
    }

    const result = convertToDbOrderBy(sortBy)

    expect(result).toBeDefined()
    expect(result).toEqual(expectedResult)
  })

  it('Should return correct order by json for newest books', () => {
    const sortBy: string = 'newest'
    const expectedResult: ISortByToOrderBy = {
      select_by: '',
      left_join: '',
      group_by: '',
      order_by: 'ORDER BY books.createdat DESC'
    }

    const result = convertToDbOrderBy(sortBy)

    expect(result).toBeDefined()
    expect(result).toEqual(expectedResult)
  })

  it('Should return correct order by json for oldest books', () => {
    const sortBy: string = 'oldest'
    const expectedResult: ISortByToOrderBy = {
      select_by: '',
      left_join: '',
      group_by: '',
      order_by: 'ORDER BY books.createdat ASC'
    }

    const result = convertToDbOrderBy(sortBy)

    expect(result).toBeDefined()
    expect(result).toEqual(expectedResult)
  })

  it('Should return correct order by json for incorrect sort by keywords', () => {
    const sortBy: string = 'incorrect_keyword'
    const expectedResult: ISortByToOrderBy = {
      select_by: '',
      left_join: '',
      group_by: '',
      order_by: ''
    }

    const result = convertToDbOrderBy(sortBy)

    expect(result).toBeDefined()
    expect(result).toEqual(expectedResult)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
