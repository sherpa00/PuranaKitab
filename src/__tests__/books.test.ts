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

    await db.query(`INSERT INTO users (username,password,salt,email) VALUES ($1,$2,$3,$4)`, [
      tempUser.username,
      tempHashedPassword,
      tempSalt,
      tempUser.email
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
