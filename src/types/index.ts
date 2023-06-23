export interface Iuser {
  userid: number
  username: string
  email: string
  password: string
  salt: string
  createdat: Date
  role: 'GUEST' | 'CUSTOMER' | 'ADMIN'
  last_login: string
}

export interface IBook {
  bookid: number
  title: string
  authorid: number
  price: number
  publication_date: string
  book_type: string
  book_condition: string
  available_quantity: number
  isbn: string
  description: string
  genre: string
  createdat: string
}

export interface ServiceResponse {
  success: boolean
  message: string
  data?: any
}

export interface IPaginationMetadata {
  total_results: number
  total_pages: number
  current_page: number
  has_next_page: boolean
  has_previous_page: boolean
}
