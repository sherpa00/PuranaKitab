/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest'
import { genSalt, hash } from 'bcrypt'
import app from '../index'
import { db } from '../configs/db.configs'
import type { Iuser } from '../types'
import { ExpressValidator } from 'express-validator'

describe('Testing book reviews routes', () => {
  // assign temporary user
  const tempUser: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: 'testing523423',
    email: 'testing950822490328@gmail.com',
    password: 'testing095'
  }

  // temporary jwttoken
  let tempJwt: string

  // temporary userid
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let currUserId: number

  // asssing new admin userdata
  const tempAdminUserData: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: 'testing12423',
    email: 'testing3598090920@gmail.com',
    password: 'testing482032'
  }

  let tempAdminUserid: number

  let tempAdminJWT: string

  let tempAddBookid: number

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

    // assining jwt and id for admin user
    const tempAdminSalt = await genSalt(10)
    const tempAdminHashedPassword = await hash(tempAdminUserData.password, tempAdminSalt)

    await db.query(`INSERT INTO users (username,password,salt,email,role) VALUES ($1,$2,$3,$4,$5)`, [
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
      .set('Authorization', 'Bearer ' + tempAdminJWT)
      .send({
        ...tempBookPayload1
      })
    tempAddBookid = tempAddBook1.body.data.bookid
  })

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

  it('Should get all book reviews for correct bookid for every user', async () => {

    // temporay req.body
    const tempReviewStars1: number = 3
    const tempReviewMessage1: string = 'Nice Book'

    const tempAddReview1 = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .post(`/review/${tempAddBookid}`)
      .set('Authorization', 'Bearer ' + tempJwt)
      .send({
        stars: tempReviewStars1,
        message: tempReviewMessage1
      })

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/review/${tempAddBookid}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.length).toBe(1)
    expect(reqBody.body.data[0].reviewid).toEqual(tempAddReview1.body.data.reviewid)
  })

  it('Should not get all book reviews for incorrect bookid for every user', async () => {
    // temporay req.body
    const tempReviewStars1: number = 3
    const tempReviewMessage1: string = 'Nice Book'

    const tempAddReview1 = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .post(`/review/${tempAddBookid}`)
      .set('Authorization', 'Bearer ' + tempJwt)
      .send({
        stars: tempReviewStars1,
        message: tempReviewMessage1
      })

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/review/347884238`)

    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })

  it('Should add book review for correct bookid, correct review stars and correct review message for authorized customer user', async () => {
    // temporay req.body
    const tempReviewStars: number = 3
    const tempReviewMessage: string = 'Nice Book'

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .post(`/review/${tempAddBookid}`)
      .set('Authorization', 'Bearer ' + tempJwt)
      .send({
        stars: tempReviewStars,
        message: tempReviewMessage
      })

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.bookid).toEqual(tempAddBookid)
    expect(reqBody.body.data.userid).toEqual(currUserId)
    expect(reqBody.body.data.stars).toEqual(tempReviewStars)
    expect(reqBody.body.data.message).toEqual(tempReviewMessage)
  })

  it('Should not add book review for incorrect bookid, correct review stars and correct review message for authorized customer user', async () => {
    // temporay req.body
    const tempReviewStars: number = 3
    const tempReviewMessage: string = 'Nice Book'

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .post(`/review/${parseInt('123555474')}`)
      .set('Authorization', 'Bearer ' + tempJwt)
      .send({
        stars: tempReviewStars,
        message: tempReviewMessage
      })

    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })

  it('Should not add book review for correct bookid, incorrect review stars and correct review message for authorized customer user', async () => {
    // temporay req.body
    const tempReviewStars: number = 7 // must be 1-5 but here greater for testing
    const tempReviewMessage: string = 'Nice Book'

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .post(`/review/${tempAddBookid}`)
      .set('Authorization', 'Bearer ' + tempJwt)
      .send({
        stars: tempReviewStars,
        message: tempReviewMessage
      })

    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.data).toBeUndefined()
  })

  it('Should not add book review for correct bookid, correct review stars and incorrect review message for authorized customer user', async () => {
    // temporay req.body
    const tempReviewStars: number = 3
    const tempReviewMessage: number = 2342342

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .post(`/review/${tempAddBookid}`)
      .set('Authorization', 'Bearer ' + tempJwt)
      .send({
        stars: tempReviewStars,
        message: tempReviewMessage
      })

    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.data).toBeUndefined()
  })

  it('Should not add book review for coorect bookid, correct review stars and correct review message for unauthorized customer user', async () => {
    // temporay req.body
    const tempReviewStars: number = 3
    const tempReviewMessage: string = 'Nice Book'

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .post(`/review/${tempAddBookid}`)
      .set('Authorization', 'Bearer ' + 'invalidJWT')
      .send({
        stars: tempReviewStars,
        message: tempReviewMessage
      })

    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.data).toBeUndefined()
  })

  // clear all temporary datas
  afterEach(async () => {
    // clear book reviews
    await db.query(`DELETE FROM reviews WHERE reviews.userid = $1 AND reviews.bookid = $2`, [currUserId, tempAddBookid])
    // clear customer user
    await db.query(`DELETE FROM users WHERE users.userid = $1`, [currUserId])
    // clear admin user
    await db.query(`DELETE FROM users WHERE users.userid = $1`, [tempAdminUserid])
    // clear author
    await db.query(`DELETE FROM authors WHERE authors.firstname = $1 AND authors.lastname = $2`, [
      tempBookPayload1.authorFirstname,
      tempBookPayload1.authorLastname
    ])
    // clear book
    await db.query(`DELETE FROM books WHERE books.bookid = $1 AND books.isbn = $2`, [
      tempAddBookid,
      tempBookPayload1.isbn
    ])
    tempJwt = ''
    currUserId = 0
  })

  // close db
  afterAll(async () => {
    await db.end()
  })
})
