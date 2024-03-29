/* eslint-disable no-console */
import request from 'supertest'
import { hash, genSalt } from 'bcrypt'
import { db } from '../../configs/db.configs'
import app from '../../index'
import { type Iuser } from '../../types/index'
import { faker } from '@faker-js/faker'

describe('Testing books search routes', () => {
  // asssing new admin userdata
  const tempAdminUserData: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }

  let tempAdminUserid: number

  let tempAdminJWT: string

  let tempAddBookid1: number
  let tempBookGenreid1: number
  let tempBookAuthorid1: number

  let tempAddBookid2: number
  let tempBookGenreid2: number
  let tempBookAuthorid2: number

  // temporary book payload for req.body
  const tempBookPayload1 = {
    title: 'testbook19032849032',
    price: 590,
    publication_date: '2005-09-18',
    book_type: 'Paper Back',
    book_condition: 'GOOD',
    available_quantity: 10,
    isbn: '123456789',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phaseljhjk hhl kjhjlus faucibus libero id facilisis mollis. Mauris eu sollicitudin risus. Nulla posuere euismod mauris at facilisis. Curabitur sagittis dictum massa, at tempor metus feugiat ut. Nunc tincidunt sem non ex molestie, vel congue quam cursus. Sed non nunc bibendum, consequat purus ac, efficitur sem. Cras eget enim ac turpis aliquam consequat in in nulla. In auctor bibendum tellus at dictum.Nullam in feugiat mauris. Quisque in elit sem. Fusce rutrum mi ac tincidunt aliquam. Proin sed enim id leo varius cursus. Morbi placerat magna a metus ultrices dapibus. Aenean lacinia pellentesque odio, id ultricies quam tincidunt et. Curabitur iaculis urna a urna auctor, at cursus dolor eleifend. Suspendisse potenti. Donec condimentum, dolor nec viverra hendrerit, lacus risus consectetur justo, eget ullamcorper elit nulla id enim. Vivamus sollicitudin malesuada magna ac efficitur. Sed vitae nulla nec eros rhoncus ultrices. Donec a lacus est.',
    genre: 'test',
    authorFirstname: 'test1firstname',
    authorLastname: 'test1lastname'
  }

  // temporary book payload for req.body
  const tempBookPayload2 = {
    title: 'testbook29483',
    price: 290,
    publication_date: '2005-09-18',
    book_type: 'Paper Back',
    book_condition: 'OLD',
    available_quantity: 10,
    isbn: '122343456789',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phaseljhjk hhl kjhjlus faucibus libero id facilisis mollis. Mauris eu sollicitudin risus. Nulla posuere euismod mauris at facilisis. Curabitur sagittis dictum massa, at tempor metus feugiat ut. Nunc tincidunt sem non ex molestie, vel congue quam cursus. Sed non nunc bibendum, consequat purus ac, efficitur sem. Cras eget enim ac turpis aliquam consequat in in nulla. In auctor bibendum tellus at dictum.Nullam in feugiat mauris. Quisque in elit sem. Fusce rutrum mi ac tincidunt aliquam. Proin sed enim id leo varius cursus. Morbi placerat magna a metus ultrices dapibus. Aenean lacinia pellentesque odio, id ultricies quam tincidunt et. Curabitur iaculis urna a urna auctor, at cursus dolor eleifend. Suspendisse potenti. Donec condimentum, dolor nec viverra hendrerit, lacus risus consectetur justo, eget ullamcorper elit nulla id enim. Vivamus sollicitudin malesuada magna ac efficitur. Sed vitae nulla nec eros rhoncus ultrices. Donec a lacus est.',
    genre: 'test',
    authorFirstname: 'test2firstname',
    authorLastname: 'test2lastname'
  }

  beforeEach(async () => {
    // assining jwt and id for admin user
    const tempAdminSalt = await genSalt(10)
    const tempAdminHashedPassword = await hash(tempAdminUserData.password, tempAdminSalt)

    await db.query('INSERT INTO users (username,password,salt,email,role) VALUES ($1,$2,$3,$4,$5)', [
      tempAdminUserData.username,
      tempAdminHashedPassword,
      tempAdminSalt,
      tempAdminUserData.email,
      'ADMIN'
    ])

    const loginAdminResponse = await request(app).post('/api/login').send({
      email: tempAdminUserData.email,
      password: tempAdminUserData.password
    })
    tempAdminJWT = loginAdminResponse.body.token
    tempAdminUserid = loginAdminResponse.body.data.userid

    // tempory add book
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })
    tempAddBookid1 = tempAddBook1.body.data.bookid
    tempBookGenreid1 = tempAddBook1.body.data.genre_id
    tempBookAuthorid1 = tempAddBook1.body.data.authorid

    const tempAddBook2 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload2
      })
    tempAddBookid2 = tempAddBook2.body.data.bookid
    tempBookGenreid2 = tempAddBook2.body.data.genre_id
    tempBookAuthorid2 = tempAddBook2.body.data.authorid
  })

  it('Should return searched books for correct search query and correct search by title', async () => {
    const tempSearchQuery: string = 'test'
    const tempSearchBy: string = 'title'

    const reqBody = await request(app).get(`/api/search?query=${tempSearchQuery}&search_by=${tempSearchBy}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.results.length).toBeGreaterThanOrEqual(2)
  })

  it('Should also return searched books for correct search query and correct search by title', async () => {
    const tempSearchQuery: string = tempBookPayload1.title
    const tempSearchBy: string = 'title'

    const reqBody = await request(app).get(`/api/search?query=${tempSearchQuery}&search_by=${tempSearchBy}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.results.length).toBeGreaterThanOrEqual(1)
  })

  it('Should also return searched books for correct search query and correct search by description', async () => {
    const tempSearchQuery: string = 'lorem'
    const tempSearchBy: string = 'description'

    const reqBody = await request(app).get(`/api/search?query=${tempSearchQuery}&search_by=${tempSearchBy}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.results).toBeDefined()
    expect(reqBody.body.data.results.length).toBeGreaterThanOrEqual(2)
  })

  it('Should return searched books for correct search query and correct search by method author', async () => {
    const tempSearchQuery: string = tempBookPayload2.authorFirstname
    const tempSearchBy: string = 'author'

    const reqBody = await request(app).get(`/api/search?query=${tempSearchQuery}&search_by=${tempSearchBy}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.results).toBeDefined()
    expect(reqBody.body.data.results.length).toBeGreaterThanOrEqual(1)
  })

  it('Should return searched books for empty correct search query and correct search by title', async () => {
    const tempSearchQuery: string = ''
    const tempSearchBy: string = 'title'

    const reqBody = await request(app).get(`/api/search?query=${tempSearchQuery}&search_by=${tempSearchBy}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.results).toBeDefined()
    expect(reqBody.body.data.results.length).toBeGreaterThanOrEqual(2)
  })

  it('Should not return searched books for incorrect search query and incorrect search by', async () => {
    const tempSearchQuery: string = ''
    const tempSearchBy: string = 'failure'

    const reqBody = await request(app).get(`/api/search?query=${tempSearchQuery}&search_by=${tempSearchBy}`)

    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.data).toBeUndefined()
  })

  it('should return searched book for correct search query and correct search by and correct page and size', async () => {
    const tempSearchQuery: string = ''
    const tempSearchBy: string = 'title'

    const tempSearchPage: number = 1
    const tempSearchSize: number = 1

    const reqBody = await request(app).get(
      `/api/search?query=${tempSearchQuery}&search_by=${tempSearchBy}&page=${tempSearchPage}&size=${tempSearchSize}`
    )

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.pagination).toBeDefined()
    expect(reqBody.body.data.pagination.current_page).toEqual(tempSearchPage)
    expect(reqBody.body.data.results).toBeDefined()
    expect(reqBody.body.data.results.length).toEqual(tempSearchSize)
  })

  it('should not return searched book for correct search query and correct search by and incorrect page and size', async () => {
    const tempSearchQuery: string = ''
    const tempSearchBy: string = 'title'

    const tempSearchPage: string = 'invaidPage'
    const tempSearchSize: number = 1

    const reqBody = await request(app).get(
      `/api/search?query=${tempSearchQuery}&search_by=${tempSearchBy}&page=${tempSearchPage}&size=${tempSearchSize}`
    )

    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })

  it('should return searched book for correct search query and correct search by and correct page and size and correct query sort by', async () => {
    const tempSearchQuery: string = ''
    const tempSearchBy: string = 'title'

    const tempSearchPage: number = 1
    const tempSearchSize: number = 1

    const tempSortBy: string = 'newest'

    const reqBody = await request(app).get(
      `/api/search?query=${tempSearchQuery}&search_by=${tempSearchBy}&page=${tempSearchPage}&size=${tempSearchSize}&sort_by=${tempSortBy}`
    )

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.pagination).toBeDefined()
    expect(reqBody.body.data.pagination.current_page).toEqual(tempSearchPage)
    expect(reqBody.body.data.results).toBeDefined()
    expect(reqBody.body.data.results.length).toEqual(tempSearchSize)
  })

  it('should not return searched book for correct search query and correct search by and correct page and size and incorrect query sort by', async () => {
    const tempSearchQuery: string = ''
    const tempSearchBy: string = 'title'

    const tempSearchPage: number = 1
    const tempSearchSize: number = 1

    const tempSortBy: number = 1

    const reqBody = await request(app).get(
      `/api/search?query=${tempSearchQuery}&search_by=${tempSearchBy}&page=${tempSearchPage}&size=${tempSearchSize}&sort_by=${tempSortBy}`
    )

    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })

  it('should return searched book for correct search query and correct search by and correct search book condition', async () => {
    const tempSearchQuery: string = ''
    const tempSearchBy: string = 'title'

    const tempSearchConditon: string = tempBookPayload1.book_condition

    const reqBody = await request(app).get(
      `/api/search?query=${tempSearchQuery}&search_by=${tempSearchBy}&condition=${tempSearchConditon}`
    )

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.pagination).toBeDefined()
    expect(reqBody.body.data.results).toBeDefined()
  })

  it('should not return searched book for correct search query and correct search by and incorrect search book condition', async () => {
    const tempSearchQuery: string = ''
    const tempSearchBy: string = 'title'

    const tempSearchConditon: number = 244329

    const reqBody = await request(app).get(
      `/api/search?query=${tempSearchQuery}&search_by=${tempSearchBy}&condition=${tempSearchConditon}`
    )

    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })

  it('should return searched book for correct search query and correct search by and correct search min-max price range', async () => {
    const tempSearchQuery: string = ''
    const tempSearchBy: string = 'title'

    const tempSearchMinPrice: number = 100
    const tempSearchMaxPrice: number = 1000

    const reqBody = await request(app).get(
      `/api/search?query=${tempSearchQuery}&search_by=${tempSearchBy}&min_price=${tempSearchMinPrice}&max_price=${tempSearchMaxPrice}`
    )

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.pagination).toBeDefined()
    expect(reqBody.body.data.results).toBeDefined()
  })

  it('should not return searched book for correct search query and correct search by and incorrect search min-max price range', async () => {
    const tempSearchQuery: string = ''
    const tempSearchBy: string = 'title'

    const tempSearchMinPrice: string = 'invalidPrice'
    const tempSearchMaxPrice: string = 'invalidPrice'

    const reqBody = await request(app).get(
      `/api/search?query=${tempSearchQuery}&search_by=${tempSearchBy}&min_price=${tempSearchMinPrice}&max_price=${tempSearchMaxPrice}`
    )

    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })

  afterEach(async () => {
    // clear admin user
    await db.query('DELETE FROM users WHERE users.userid = $1', [tempAdminUserid])

    // clear book
    await db.query('DELETE FROM books WHERE books.bookid = $1 AND books.genre_id = $2 AND books.authorid = $3', [
      tempAddBookid1,
      tempBookGenreid1,
      tempBookAuthorid1
    ])
    await db.query('DELETE FROM books WHERE books.bookid = $1 AND books.genre_id = $2 AND books.authorid = $3', [
      tempAddBookid2,
      tempBookGenreid2,
      tempBookAuthorid2
    ])

    // clear author
    await db.query('DELETE FROM authors WHERE authors.authorid = $1', [tempBookAuthorid1])
    await db.query('DELETE FROM authors WHERE authors.authorid = $1', [tempBookAuthorid2])

    // clear genre
    await db.query('DELETE FROM genres WHERE genres.genre_id = $1', [tempBookGenreid1])
    await db.query('DELETE FROM genres WHERE genres.genre_id = $1', [tempBookGenreid2])
  })

  // close dbs
  afterAll(async () => {
    await db.end()
  })
})
