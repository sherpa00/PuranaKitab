/* eslint-disable no-console */
import request from 'supertest'
import { hash, genSalt } from 'bcrypt'
import { db } from '../configs/db.configs'
import app from '../index'
import { type Iuser } from '../types/index'

describe('Testing books search routes', () => {
  // asssing new admin userdata
  const tempAdminUserData: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: 'testing12423',
    email: 'testing3598090920@gmail.com',
    password: 'testing482032'
  }

  let tempAdminUserid: number

  let tempAdminJWT: string

  let tempAddBookid1: number

  let tempAddBookid2: number

  // temporary book payload for req.body
  const tempBookPayload1 = {
    title: 'testbook1',
    price: 590,
    publication_date: '2005-09-18',
    book_type: 'Paper Back',
    book_condition: 'GOOD',
    available_quantity: 10,
    isbn: '123456789',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phaseljhjk hhl kjhjlus faucibus libero id facilisis mollis. Mauris eu sollicitudin risus. Nulla posuere euismod mauris at facilisis. Curabitur sagittis dictum massa, at tempor metus feugiat ut. Nunc tincidunt sem non ex molestie, vel congue quam cursus. Sed non nunc bibendum, consequat purus ac, efficitur sem. Cras eget enim ac turpis aliquam consequat in in nulla. In auctor bibendum tellus at dictum.Nullam in feugiat mauris. Quisque in elit sem. Fusce rutrum mi ac tincidunt aliquam. Proin sed enim id leo varius cursus. Morbi placerat magna a metus ultrices dapibus. Aenean lacinia pellentesque odio, id ultricies quam tincidunt et. Curabitur iaculis urna a urna auctor, at cursus dolor eleifend. Suspendisse potenti. Donec condimentum, dolor nec viverra hendrerit, lacus risus consectetur justo, eget ullamcorper elit nulla id enim. Vivamus sollicitudin malesuada magna ac efficitur. Sed vitae nulla nec eros rhoncus ultrices. Donec a lacus est.',
    authorFirstname: 'test1firstname',
    authorLastname: 'test1lastname'
  }

  // temporary book payload for req.body
  const tempBookPayload2 = {
    title: 'testbook2',
    price: 290,
    publication_date: '2005-09-18',
    book_type: 'Paper Back',
    book_condition: 'OLD',
    available_quantity: 10,
    isbn: '122343456789',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phaseljhjk hhl kjhjlus faucibus libero id facilisis mollis. Mauris eu sollicitudin risus. Nulla posuere euismod mauris at facilisis. Curabitur sagittis dictum massa, at tempor metus feugiat ut. Nunc tincidunt sem non ex molestie, vel congue quam cursus. Sed non nunc bibendum, consequat purus ac, efficitur sem. Cras eget enim ac turpis aliquam consequat in in nulla. In auctor bibendum tellus at dictum.Nullam in feugiat mauris. Quisque in elit sem. Fusce rutrum mi ac tincidunt aliquam. Proin sed enim id leo varius cursus. Morbi placerat magna a metus ultrices dapibus. Aenean lacinia pellentesque odio, id ultricies quam tincidunt et. Curabitur iaculis urna a urna auctor, at cursus dolor eleifend. Suspendisse potenti. Donec condimentum, dolor nec viverra hendrerit, lacus risus consectetur justo, eget ullamcorper elit nulla id enim. Vivamus sollicitudin malesuada magna ac efficitur. Sed vitae nulla nec eros rhoncus ultrices. Donec a lacus est.',
    authorFirstname: 'test1firstname',
    authorLastname: 'test1lastname'
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

    const loginAdminResponse = await request(app).post('/login').send({
      email: tempAdminUserData.email,
      password: tempAdminUserData.password
    })
    tempAdminJWT = loginAdminResponse.body.token
    tempAdminUserid = loginAdminResponse.body.data.userid

    // tempory add book
    const tempAddBook1 = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })
    tempAddBookid1 = tempAddBook1.body.data.bookid
    const tempAddBook2 = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload2
      })
    tempAddBookid2 = tempAddBook2.body.data.bookid
  })

  it('Should return searched books for correct search query and correct search by title', async () => {
    const tempSearchQuery: string = 'test'
    const tempSearchBy: string = 'title'

    const reqBody = await request(app).get(`/search?query=${tempSearchQuery}&search_by=${tempSearchBy}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.results.length).toEqual(2)
  })

  it('Should also return searched books for correct search query and correct search by title', async () => {
    const tempSearchQuery: string = tempBookPayload1.title
    const tempSearchBy: string = 'title'

    const reqBody = await request(app).get(`/search?query=${tempSearchQuery}&search_by=${tempSearchBy}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.results.length).toEqual(1)
    expect(reqBody.body.data.results[0].title).toEqual(tempBookPayload1.title)
  })

  it('Should also return searched books for correct search query and correct search by description', async () => {
    const tempSearchQuery: string = 'lorem'
    const tempSearchBy: string = 'description'

    const reqBody = await request(app).get(`/search?query=${tempSearchQuery}&search_by=${tempSearchBy}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.results).toBeDefined()
    expect(reqBody.body.data.results.length).toEqual(2)
  })

  it('Should return searched books for correct search query and correct search by method author', async () => {
    const tempSearchQuery: string = tempBookPayload2.authorFirstname
    const tempSearchBy: string = 'author'

    const reqBody = await request(app).get(`/search?query=${tempSearchQuery}&search_by=${tempSearchBy}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.results).toBeDefined()
    expect(reqBody.body.data.results.length).toEqual(2)
  })

  it('Should return searched books for empty correct search query and correct search by title', async () => {
    const tempSearchQuery: string = ''
    const tempSearchBy: string = 'title'

    const reqBody = await request(app).get(`/search?query=${tempSearchQuery}&search_by=${tempSearchBy}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.results).toBeDefined()
    expect(reqBody.body.data.results.length).toEqual(2)
  })

  it('Should not return searched books for incorrect search query and incorrect search by', async () => {
    const tempSearchQuery: string = ''
    const tempSearchBy: string = 'failure'

    const reqBody = await request(app).get(`/search?query=${tempSearchQuery}&search_by=${tempSearchBy}`)

    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.data).toBeUndefined()
  })

  afterEach(async () => {
    // clear admin user
    await db.query('DELETE FROM users WHERE users.userid = $1', [tempAdminUserid])
    // clear author
    await db.query('DELETE FROM authors WHERE authors.firstname = $1 AND authors.lastname = $2', [
      tempBookPayload1.authorFirstname,
      tempBookPayload1.authorLastname
    ])
    // clear book
    await db.query('DELETE FROM books WHERE books.bookid = $1 AND books.isbn = $2', [
      tempAddBookid1,
      tempBookPayload1.isbn
    ])
    await db.query('DELETE FROM books WHERE books.bookid = $1 AND books.isbn = $2', [
      tempAddBookid2,
      tempBookPayload2.isbn
    ])
  })

  // close db
  afterAll(async () => {
    await db.end()
  })
})
