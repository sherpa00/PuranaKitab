import request from 'supertest'
import { genSalt, hash } from 'bcrypt'
import app from '../index'
import { db } from '../configs/db.configs'
import type { Iuser } from '../types'

describe('Testing cart routes', () => {
    // assign temporary user
  const tempUser: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: 'testing523423',
    email: 'testing95083290909045328@gmail.com',
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
    email: 'testing183598021548390920@gmail.com',
    password: 'testing482032'
  }

  let tempAdminUserid: number

  let tempAdminJWT: string

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

  // temporary book payload for req.body
  const tempBookPayload2 = {
    title: 'testbook2',
    price: 700,
    publication_date: '2002-10-18',
    book_type: 'Paper Back',
    book_condition: 'OLD',
    available_quantity: 15,
    isbn: '135791011',
    description:
      'Lorem ipsum dolor sit amet, consectekjlhjk jkhkjh jkhljk hkjlhjktur adipiscing elit. Phaseljhjk hhl kjhjlus faucibus libero id facilisis mollis. Mauris eu sollicitudin risus. Nulla posuere euismod mauris at facilisis. Curabitur sagittis dictum massa, at tempor metus feugiat ut. Nunc tincidunt sem non ex molestie, vel congue quam cursus. Sed non nunc bibendum, consequat purus ac, efficitur sem. Cras eget enim ac turpis aliquam consequat in in nulla. In auctor bibendum tellus at dictum.Nullam in feugiat mauris. Quisque in elit sem. Fusce rutrum mi ac tincidunt aliquam. Proin sed enim id leo varius cursus. Morbi placerat magna a metus ultrices dapibus. Aenean lacinia pellentesque odio, id ultricies quam tincidunt et. Curabitur iaculis urna a urna auctor, at cursus dolor eleifend. Suspendisse potenti. Donec condimentum, dolor nec viverra hendrerit, lacus risus consectetur justo, eget ullamcorper elit nulla id enim. Vivamus sollicitudin malesuada magna ac efficitur. Sed vitae nulla nec eros rhoncus ultrices. Donec a lacus est.',
    authorFirstname: 'test2firstname',
    authorLastname: 'test2lastname'
  }

  it('Should add new cart for correct bookid and quantity for authorized customer user', async() => {
    // tempory add book
    const tempAddBook1 = await request(app)
        .post('/books')
        .set('Authorization', 'Bearer ' + tempAdminJWT)
        .send({
            ...tempBookPayload1
        })

    const reqBody = await request(app)
        .post('/cart')
        .set('Authorization', 'Bearer ' + tempJwt)
        .send({
            bookid: parseInt(tempAddBook1.body.data.bookid),
            quantity: 5
        })
    
    console.log('-----------------------------------')
    console.log(reqBody.body)
    console.log('-----------------------------------')

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.bookid).toEqual(tempAddBook1.body.data.bookid)
    expect(reqBody.body.data.userid).toEqual(currUserId)
  })


  // clear all temporary datas
  afterEach(async () => {
    // clear cart 
    await db.query(`DELETE FROM carts WHERE carts.userid = $1`, [currUserId])
    // clear customer user
    await db.query(`DELETE FROM users WHERE users.userid = $1`, [currUserId])
    // clear admin user
    await db.query(`DELETE FROM users WHERE users.userid = $1`, [tempAdminUserid])
    // clear author
    await db.query(`DELETE FROM authors WHERE authors.firstname = $1 AND authors.lastname = $2`, [
      tempBookPayload1.authorFirstname,
      tempBookPayload1.authorLastname
    ])
    await db.query(`DELETE FROM authors WHERE authors.firstname = $1 AND authors.lastname = $2`, [
        tempBookPayload2.authorFirstname,
        tempBookPayload2.authorLastname
      ])
    // clear book
    await db.query(`DELETE FROM books WHERE books.isbn = $1`, [
      tempBookPayload1.isbn
    ])
    await db.query(`DELETE FROM books WHERE books.isbn = $1`, [
        tempBookPayload2.isbn
      ])
    tempJwt = ''
    currUserId = 0
  })

  // close db
  afterAll(async () => {
    await db.end()
  })
})