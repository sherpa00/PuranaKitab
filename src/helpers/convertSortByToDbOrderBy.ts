import logger from '../utils/logger.utils'

export interface ISortByToOrderBy {
  select_by: string
  left_join: string
  group_by: string
  order_by: string
}

// helper function to convert req.query sort_by value to acceptable db order_by json values
export const convertToDbOrderBy = (sortBy: string): ISortByToOrderBy => {
  try {
    let resultOrderBy: ISortByToOrderBy = {
      select_by: '',
      left_join: '',
      group_by: '',
      order_by: ''
    }
    switch (sortBy) {
      case 'most_reviewed':
        resultOrderBy = {
          select_by: ', COUNT(reviews.reviewid) AS review_count',
          left_join: 'LEFT JOIN reviews ON books.bookid = reviews.bookid',
          group_by: 'GROUP BY books.bookid, genres.genre_id, reviews.reviewid',
          order_by: 'ORDER BY review_count DESC'
        }
        break
      case 'least_reviewed':
        resultOrderBy = {
          select_by: ', COUNT(reviews.reviewid) AS review_count',
          left_join: 'LEFT JOIN reviews ON books.bookid = reviews.bookid',
          group_by: 'GROUP BY books.bookid,genres.genre_id, reviews.reviewid',
          order_by: 'ORDER BY review_count ASC'
        }
        break
      case 'alphabetically_asc':
        resultOrderBy = {
          select_by: '',
          left_join: '',
          group_by: '',
          order_by: 'ORDER BY books.title ASC'
        }
        break
      case 'alphabetically_desc':
        resultOrderBy = {
          select_by: '',
          left_join: '',
          group_by: '',
          order_by: 'ORDER BY books.title DESC'
        }
        break
      case 'price_high':
        resultOrderBy = {
          select_by: '',
          left_join: '',
          group_by: '',
          order_by: 'ORDER BY books.price DESC'
        }
        break
      case 'price_low':
        resultOrderBy = {
          select_by: '',
          left_join: '',
          group_by: '',
          order_by: 'ORDER BY books.price ASC'
        }
        break
      case 'newest':
        resultOrderBy = {
          select_by: '',
          left_join: '',
          group_by: '',
          order_by: 'ORDER BY books.createdat DESC'
        }
        break
      case 'oldest':
        resultOrderBy = {
          select_by: '',
          left_join: '',
          group_by: '',
          order_by: 'ORDER BY books.createdat ASC'
        }
        break
    }

    return resultOrderBy
  } catch (err) {
    logger.error(err, 'Error while converting req.query sort_by to db order_by json')
    return {
      select_by: '',
      left_join: '',
      group_by: '',
      order_by: ''
    }
  }
}
