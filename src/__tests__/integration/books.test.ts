import request from 'supertest'
import { genSalt, hash } from 'bcrypt'
import app from '../../index'
import { db } from '../../configs/db.configs'
import { type Iuser } from '../../types'

describe('Testing book routes', () => {
  // assign temporary user
  const tempUser: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: 'testing4',
    email: 'testing9509kjb40329045328@gmail.com',
    password: 'testing4klj'
  }

  // temporary jwttoken
  let tempJwt: string

  // temporary userid
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let currUserId: number

  // asssing new admin userdata
  const tempAdminUserData: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: 'testing1289423',
    email: 'test238095483hg90920@gmail.com',
    password: 'testing489032'
  }

  let tempAdminUserid: number

  let tempAdminJWT: string

  beforeEach(async () => {
    const tempSalt = await genSalt(10)
    const tempHashedPassword = await hash(tempUser.password, tempSalt)

    await db.query('INSERT INTO users (username,password,salt,email,role) VALUES ($1,$2,$3,$4,$5)', [
      tempUser.username,
      tempHashedPassword,
      tempSalt,
      tempUser.email,
      'CUSTOMER'
    ])

    const loginResponse = await request(app).post('/api/login').send({
      email: tempUser.email,
      password: tempUser.password
    })

    tempJwt = loginResponse.body.token

    currUserId = loginResponse.body.data.userid

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
  })

  // temporary book payload for req.body
  const tempBookPayload = {
    title: 'testbook',
    price: 1000,
    publication_date: '2005-05-10',
    book_type: 'Paper Back',
    book_condition: 'GOOD',
    available_quantity: 8,
    isbn: '12345234',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscitennec a lacus est.',
    genre: 'testGenre',
    authorFirstname: 'testfirstname',
    authorLastname: 'testlastname'
  }

  // update title temp
  const tempBookUpdateTitle: string = 'NewUpdatedTitle'

  it('Should get all books for authorized user', async () => {
    const reqBody = await request(app).get('/api/books').set('Authorization', `Bearer ${tempJwt}`)
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.results).toBeDefined()
  })

  it('Should get all books for guest user too', async () => {
    const reqBody = await request(app).get('/api/books')
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.results).toBeDefined()
  })

  it('Should get all books using pagination', async () => {
    const tempPage: number = 1
    const tempSize: number = 3

    const reqBody = await request(app).get(`/api/books?page=${tempPage}&size=${tempSize}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.results).toBeDefined()
  })

  it('Should get a book with correct bookid for authorized user', async () => {
    // add temporary book
    const tempBookAdd = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send(tempBookPayload)

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/api/books/${tempBookAdd.body.data.bookid}`)
      .set('Authorization', `Bearer ${tempJwt}`)
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.bookid).toBe(tempBookAdd.body.data.bookid)
    expect(reqBody.body.data.title).toEqual(tempBookPayload.title)
    expect(reqBody.body.data.isbn).toEqual(tempBookPayload.isbn)
  })

  it('Should not get a book with incorrect bookid for authorized user', async () => {
    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/api/books/${23434223}`)
      .set('Authorization', `Bearer ${tempJwt}`)
    expect(reqBody.statusCode).toBe(404)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should not get a book with incorrect bookid of type String for authorized user', async () => {
    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get('/api/books/thisisnotvalid')
      .set('Authorization', `Bearer ${tempJwt}`)
    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should get a book with correct bookid for guest user', async () => {
    // add temporary book
    const tempBookAdd = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send(tempBookPayload)

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/api/books/${tempBookAdd.body.data.bookid}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.bookid).toBe(tempBookAdd.body.data.bookid)
    expect(reqBody.body.data.title).toEqual(tempBookPayload.title)
    expect(reqBody.body.data.isbn).toEqual(tempBookPayload.isbn)
  })

  it('Should return success for adding new book with authorized admin user and correct payload', async () => {
    const reqBody = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send(tempBookPayload)
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.title).toEqual('testbook')
    expect(reqBody.body.data.isbn).toEqual(tempBookPayload.isbn)
  })

  it('Should return false for adding new book with unauthorized admin user (CUSTOMER) and correct payload', async () => {
    const reqBody = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        ...tempBookPayload
      })
    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should return false for adding new book with authorized admin user and incorrect payload', async () => {
    const reqBody = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload,
        title: ''
      })
    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should update book with correct type and correct bookid for authorized admin user', async () => {
    const tempNewBookInfo = {
      title: tempBookUpdateTitle
    }

    // add temporary book
    const tempBookAdd = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send(tempBookPayload)

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .patch(`/api/books/${tempBookAdd.body.data.bookid}`)
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send(tempNewBookInfo)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.bookid).toEqual(tempBookAdd.body.data.bookid)
    expect(reqBody.body.data.title).toEqual(tempNewBookInfo.title)
  })

  it('Should return false for updating book with correct type and incorrect bookid for authorized admin user', async () => {
    const tempNewBookInfo = {
      title: tempBookUpdateTitle
    }

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .patch('/api/books/12862384')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send(tempNewBookInfo)

    expect(reqBody.statusCode).toBe(500)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should return false for updating book with incorrect type and correct bookid for authorized admin user', async () => {
    const tempNewBookInfo = {
      price: 'invalidPrice'
    }

    // add temporary book
    const tempBookAdd = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send(tempBookPayload)

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .patch(`/api/books/${tempBookAdd.body.data.bookid}`)
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send(tempNewBookInfo)

    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should return false for updating book with correct type and correct bookid for unauthorized admin user (CUSTOMER)', async () => {
    const tempNewBookInfo = {
      title: tempBookUpdateTitle
    }

    // add temporary book
    const tempBookAdd = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send(tempBookPayload)

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .patch(`/api/books/${tempBookAdd.body.data.bookid}`)
      .set('Authorization', `Bearer ${tempJwt}`)
      .send(tempNewBookInfo)

    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should remove a book with correct bookid for authorized admin user', async () => {
    // add temporary book
    const tempBookAdd = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send(tempBookPayload)

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .delete(`/api/books/${tempBookAdd.body.data.bookid}`)
      .set('Authorization', `Bearer ${tempAdminJWT}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.bookid).toEqual(tempBookAdd.body.data.bookid)
  })

  it('Should not remove a book with incorrect bookid for authorized admin user', async () => {
    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .delete('/api/books/94849023')
      .set('Authorization', `Bearer ${tempAdminJWT}`)

    expect(reqBody.statusCode).toBe(500)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should not remove a book with correct bookid for unauthorized admin user (CUSTOMER)', async () => {
    // add temporary book
    const tempBookAdd = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send(tempBookPayload)

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .delete(`/api/books/${tempBookAdd.body.data.bookid}`)
      .set('Authorization', `Bearer ${tempJwt}`)

    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.success).toBeFalsy()
  })

  // clear all temporary datas
  afterEach(async () => {
    // clear customer user
    await db.query('DELETE FROM users WHERE users.userid = $1', [currUserId])
    // clear admin user
    await db.query('DELETE FROM users WHERE users.userid = $1', [tempAdminUserid])
    // clear author
    await db.query('DELETE FROM authors WHERE authors.firstname = $1 AND authors.lastname = $2', [
      tempBookPayload.authorFirstname,
      tempBookPayload.authorLastname
    ])
    // clear book
    await db.query('DELETE FROM books WHERE books.title = $1 AND books.isbn = $2', [
      tempBookPayload.title,
      tempBookPayload.isbn
    ])
    // clear update book
    await db.query('DELETE FROM books WHERE books.title = $1 AND books.isbn = $2', [
      tempBookUpdateTitle,
      tempBookPayload.isbn
    ])
    // clear genre
    await db.query('DELETE FROM genres WHERE genres.genre_name ILIKE $1', [tempBookPayload.genre])
    tempJwt = ''
    currUserId = 0
  })

  // close db
  afterAll(async () => {
    await db.end()
  })
})
