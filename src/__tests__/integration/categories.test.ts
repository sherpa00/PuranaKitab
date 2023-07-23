/* eslint-disable quotes */
import request from 'supertest'
import { hash, genSalt } from 'bcrypt'
import app from '../../index'
import { db } from '../../configs/db.configs'
import { type Iuser } from '../../types'

describe('Testing book genres routes', () => {

  // assign temporary user
  const tempAdminUser: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: 'testing2',
    email: 'testing2409382094832@gmail.com',
    password: 'testing3'
  }

  // temporary jwttoken
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let tempAdminJwt: string

  // temporary userid
  let currAdminUserId: number

  // temporary book payload for req.body
  const tempBookPayload1 = {
    title: 'testbook184209',
    price: 590,
    publication_date: '20023-01-18',
    book_type: 'Paper Back',
    book_condition: 'GOOD',
    available_quantity: 10,
    isbn: '1234569840923789',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phaseljhjk hhl kjhjlus faucibus libero id facilisis mollis. Mauris eu sollicitudin risus. Nulla posuere euismod mauris at facilisis. Curabitur sagittis dictum massa, at tempor metus feugiat ut. Nunc tincidunt sem non ex molestie, vel congue quam cursus. Sed non nunc bibendum, consequat purus ac, efficitur sem. Cras eget enim ac turpis aliquam consequat in in nulla. In auctor bibendum tellus at dictum.Nullam in feugiat mauris. Quisque in elit sem. Fusce rutrum mi ac tincidunt aliquam. Proin sed enim id leo varius cursus. Morbi placerat magna a metus ultrices dapibus. Aenean lacinia pellentesque odio, id ultricies quam tincidunt et. Curabitur iaculis urna a urna auctor, at cursus dolor eleifend. Suspendisse potenti. Donec condimentum, dolor nec viverra hendrerit, lacus risus consectetur justo, eget ullamcorper elit nulla id enim. Vivamus sollicitudin malesuada magna ac efficitur. Sed vitae nulla nec eros rhoncus ultrices. Donec a lacus est.',
    genre: 'testGenre',
    authorFirstname: 'Test1843firstname',
    authorLastname: 'Test10942lastname'
  }

  let tempAddBookid: number
  let tempAuthorid: number
  let tempGenreid: number

  beforeEach(async () => {
    // add temp admin user
    // assining jwt and id for admin user
    const tempAdminSalt = await genSalt(10)
    const tempAdminHashedPassword = await hash(tempAdminUser.password, tempAdminSalt)

    await db.query('INSERT INTO users (username,password,salt,email,role) VALUES ($1,$2,$3,$4,$5)', [
      tempAdminUser.username,
      tempAdminHashedPassword,
      tempAdminSalt,
      tempAdminUser.email,
      'ADMIN'
    ])

    const loginAdminResponse = await request(app).post('/api/login').send({
      email: tempAdminUser.email,
      password: tempAdminUser.password
    })

    tempAdminJwt = loginAdminResponse.body.token

    currAdminUserId = loginAdminResponse.body.data.userid

    // tempory add book
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJwt}`)
      .send({
        ...tempBookPayload1
      })
    tempAddBookid = tempAddBook1.body.data.bookid
    tempAuthorid = tempAddBook1.body.data.authorid
    tempGenreid = tempAddBook1.body.data.genre_id
  })

  it('Should return categories best seller books', async () => {
    const reqBody = await request(app)
        .get(
            '/api/categories/best-seller'
        )
        
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.results).toBeDefined()
  })

  it('Should return categories best seller books for correct query page and size', async () => {
    const page: number = 1
    const size: number = 1

    const reqBody = await request(app)
        .get(
            `/api/categories/best-seller?page=${page}&size=${size}`
        )
        
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.pagination).toBeDefined()
    expect(reqBody.body.data.pagination.current_page).toEqual(page)
    expect(reqBody.body.data.results).toBeDefined()
  })

  it('Should not return categories best seller books for incorrect query type page and size', async () => {
    const page: string = 'ksfd'
    const size: number = 1

    const reqBody = await request(app)
        .get(
            `/api/categories/best-seller?page=${page}&size=${size}`
        )
        
    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })


  it('Should return categories top rated books', async () => {
    const reqBody = await request(app)
        .get(
            '/api/categories/top-rated'
        )
        
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.results).toBeDefined()
  })

  it('Should return categories top rated books for correct query page and size', async () => {
    const page: number = 1
    const size: number = 1

    const reqBody = await request(app)
        .get(
            `/api/categories/top-rated?page=${page}&size=${size}`
        )
        
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.pagination).toBeDefined()
    expect(reqBody.body.data.pagination.current_page).toEqual(page)
    expect(reqBody.body.data.results).toBeDefined()
  })

  it('Should not return categories top rated books for incorrect query type page and size', async () => {
    const page: string = 'ksfd'
    const size: number = 1

    const reqBody = await request(app)
        .get(
            `/api/categories/top-rated?page=${page}&size=${size}`
        )
        
    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })


  it('Should return categories new arrivals books', async () => {
    const reqBody = await request(app)
        .get(
            '/api/categories/new-arrivals'
        )
        
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.results).toBeDefined()
  })

  it('Should return categories new arrivals books for correct query page and size', async () => {
    const page: number = 1
    const size: number = 1

    const reqBody = await request(app)
        .get(
            `/api/categories/new-arrivals?page=${page}&size=${size}`
        )
        
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.pagination).toBeDefined()
    expect(reqBody.body.data.pagination.current_page).toEqual(page)
    expect(reqBody.body.data.results).toBeDefined()
  })

  it('Should not return categories new arrivals books for incorrect query type page and size', async () => {
    const page: string = 'ksfd'
    const size: number = 1

    const reqBody = await request(app)
        .get(
            `/api/categories/new-arrivals?page=${page}&size=${size}`
        )
        
    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })

  it('Should return categories recently added books', async () => {
    const reqBody = await request(app)
        .get(
            '/api/categories/recently-added'
        )
        
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.results).toBeDefined()
  })

  it('Should return categories recently added books for correct query page and size', async () => {
    const page: number = 1
    const size: number = 1

    const reqBody = await request(app)
        .get(
            `/api/categories/recently-added?page=${page}&size=${size}`
        )
        
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.pagination).toBeDefined()
    expect(reqBody.body.data.pagination.current_page).toEqual(page)
    expect(reqBody.body.data.results).toBeDefined()
  })

  it('Should not return categories recently added books for incorrect query type page and size', async () => {
    const page: string = 'ksfd'
    const size: number = 1

    const reqBody = await request(app)
        .get(
            `/api/categories/recently-added?page=${page}&size=${size}`
        )
        
    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })

  afterEach(async () => {
    // clear admin user
    await db.query('DELETE FROM users WHERE users.userid = $1', [currAdminUserId])
    // clear books
    await db.query('DELETE FROM books WHERE books.bookid = $1',[tempAddBookid])
    // clear book authors
    await db.query('DELETE FROM authors WHERE authors.authorid = $1',[tempAuthorid])
    // clear book genres
    await db.query('DELETE FROM genres WHERE genres.genre_id = $1', [tempGenreid])
    tempAdminJwt = ''
    currAdminUserId = 0
  })

  afterAll(async () => {
    await db.end()
  })
})