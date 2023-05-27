import request from 'supertest'
import app from '../index'
import { db } from '../configs/db.configs'
import { genSalt, hash } from 'bcrypt'
import { type Iuser } from '../types'

describe('Testing book routes', () => {
  // assign temporary user
  const tempUser: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: 'testing4',
    email: 'testing4@gmail.com',
    password: 'testing4'
  }

  // temporary jwttoken
  let tempJwt: string

  // temporary userid
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let currUserId: number

  beforeEach(async () => {
    const tempSalt = await genSalt(10)
    const tempHashedPassword = await hash(tempUser.password, tempSalt)

    await db.query(`INSERT INTO users (username,password,salt,email,role) VALUES ($1,$2,$3,$4,$5)`, [
      tempUser.username,
      tempHashedPassword,
      tempSalt,
      tempUser.email,
      'CUSTOMER'
    ])

    const loginResponse = await request(app).post('/login').send({
      email: tempUser.email,
      password: tempUser.password
    })

    tempJwt = loginResponse.body.token

    currUserId = loginResponse.body.data.userid
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
    authorFirstname: 'testfirstname',
    authorLastname: 'testlastname'
  }

  it('Should get all books for authorized user', async () => {
    const reqBody = await request(app)
      .get('/books')
      .set('Authorization', 'Bearer ' + tempJwt)
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
  })

  it('Should return false while getting all books for unauthorized user', async () => {
    const reqBody = await request(app)
      .get('/books')
      .set('Authorization', 'Bearer ' + 'invalidJWT')
    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should get a book with correct bookid for authorized user', async () => {
    // add temporary book
    const tempBookAdd = await request(app)
      .post('/books')
      .set('Authorization', 'Bearer ' + tempJwt)
      .send(tempBookPayload)

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/books/${tempBookAdd.body.data.bookid}`)
      .set('Authorization', 'Bearer ' + tempJwt)
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.bookid).toBe(tempBookAdd.body.data.bookid)
    expect(reqBody.body.data.title).toEqual(tempBookPayload.title)
    expect(reqBody.body.data.isbn).toEqual(tempBookPayload.isbn)
  })

  it('Should not get a book with incorrect bookid for authorized user', async () => {
    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/books/${23434223}`)
      .set('Authorization', 'Bearer ' + tempJwt)
    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should not get a book with incorrect bookid of type String for authorized user', async () => {
    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/books/thisisnotvalid`)
      .set('Authorization', 'Bearer ' + tempJwt)
    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.errors).toBeDefined()
    expect(reqBody.body.errors[0].path).toEqual('bookid')
  })

  it('Should not get a book with correct bookid for unauthorized user', async () => {
    // add temporary book
    const tempBookAdd = await request(app)
      .post('/books')
      .set('Authorization', 'Bearer ' + tempJwt)
      .send(tempBookPayload)

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/books/${tempBookAdd.body.data.bookid}`)
      .set('Authorization', 'Bearer ' + 'invalidJWT')
    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should return success for adding new book with authorized user and correct payload', async () => {
    const reqBody = await request(app)
      .post('/books')
      .set('Authorization', 'Bearer ' + tempJwt)
      .send(tempBookPayload)
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.title).toEqual('testbook')
    expect(reqBody.body.data.isbn).toEqual(tempBookPayload.isbn)
  })

  it('Should return false for adding new book with unauthorized user and correct payload', async () => {
    const reqBody = await request(app)
      .post('/books')
      .set('Authorization', 'Bearer ' + 'invalidJWT')
      .send({
        ...tempBookPayload
      })
    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should return false for adding new book with authorized user and incorrect payload', async () => {
    const reqBody = await request(app)
      .post('/books')
      .set('Authorization', 'Bearer ' + tempJwt)
      .send({
        ...tempBookPayload,
        title: ''
      })
    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.errors[0].path).toEqual('title')
  })

  it('Should update book with correct type and correct bookid for authorized user', async () => {
    const tempNewBookInfo = {
      title: 'NewBookTitle'
    }

    // add temporary book
    const tempBookAdd = await request(app)
      .post('/books')
      .set('Authorization', 'Bearer ' + tempJwt)
      .send(tempBookPayload)

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .patch(`/books/${tempBookAdd.body.data.bookid}`)
      .set('Authorization', 'Bearer ' + tempJwt)
      .send(tempNewBookInfo)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.bookid).toEqual(tempBookAdd.body.data.bookid)
    expect(reqBody.body.data.title).toEqual(tempNewBookInfo.title)
  })

  it('Should return false for updating book with correct type and incorrect bookid for authorized user', async () => {
    const tempNewBookInfo = {
      title: 'NewBookTitle'
    }

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .patch(`/books/12862384`)
      .set('Authorization', 'Bearer ' + tempJwt)
      .send(tempNewBookInfo)

    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should return false for updating book with incorrect type and correct bookid for authorized user', async () => {
    const tempNewBookInfo = {
      price: 'invalidPrice'
    }

    // add temporary book
    const tempBookAdd = await request(app)
      .post('/books')
      .set('Authorization', 'Bearer ' + tempJwt)
      .send(tempBookPayload)

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .patch(`/books/${tempBookAdd.body.data.bookid}`)
      .set('Authorization', 'Bearer ' + tempJwt)
      .send(tempNewBookInfo)

    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.errors).toBeDefined()
    expect(reqBody.body.errors[0].path).toEqual('price')
  })

  it('Should return false for updating book with correct type and correct bookid for unauthorized user', async () => {
    const tempNewBookInfo = {
      title: 'NewBookTitle'
    }

    // add temporary book
    const tempBookAdd = await request(app)
      .post('/books')
      .set('Authorization', 'Bearer ' + tempJwt)
      .send(tempBookPayload)

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .patch(`/books/${tempBookAdd.body.data.bookid}`)
      .set('Authorization', 'Bearer ' + 'invalidJWT')
      .send(tempNewBookInfo)

    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should remove a book with correct bookid for authorized user', async () => {
    // add temporary book
    const tempBookAdd = await request(app)
      .post('/books')
      .set('Authorization', 'Bearer ' + tempJwt)
      .send(tempBookPayload)

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .delete(`/books/${tempBookAdd.body.data.bookid}`)
      .set('Authorization', 'Bearer ' + tempJwt)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.bookid).toEqual(tempBookAdd.body.data.bookid)
  })

  it('Should not remove a book with incorrect bookid for authorized user', async () => {
    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .delete(`/books/94384923849023`)
      .set('Authorization', 'Bearer ' + tempJwt)

    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should not remove a book with correct bookid for unauthorized user', async () => {
    // add temporary book
    const tempBookAdd = await request(app)
      .post('/books')
      .set('Authorization', 'Bearer ' + tempJwt)
      .send(tempBookPayload)

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .delete(`/books/${tempBookAdd.body.data.bookid}`)
      .set('Authorization', 'Bearer ' + 'invalidJWT')

    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.success).toBeFalsy()
  })

  // clear all temporary datas
  afterEach(async () => {
    await db.query(`DELETE FROM users WHERE users.userid = $1`, [currUserId])
    await db.query(`DELETE FROM authors WHERE authors.firstname = $1 AND authors.lastname = $2`, [
      tempBookPayload.authorFirstname,
      tempBookPayload.authorLastname
    ])
    await db.query(`DELETE FROM books WHERE books.title = $1 AND books.isbn = $2`, [
      tempBookPayload.title,
      tempBookPayload.isbn
    ])
    tempJwt = ''
    currUserId = 0
  })

  // close db
  afterAll(async () => {
    await db.end()
  })
})
