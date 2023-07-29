/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest'
import { genSalt, hash } from 'bcrypt'
import app from '../../index'
import { db } from '../../configs/db.configs'
import type { Iuser } from '../../types'
import { OnlineCardDetails } from '../../services/orders.service'

describe('Testing orders routes', () => {
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
    genre: 'testGenre',
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
    genre: 'testGenre2',
    authorFirstname: 'test2firstname',
    authorLastname: 'test2lastname'
  }

  it('Should place order (cash-on-delivery) for correct body array of object cartids and body phone number', async () => {
    // temp add books
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })

    // temp add carts
    const tempAddCart1 = await request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        bookid: parseInt(tempAddBook1.body.data.bookid),
        quantity: 1
      })

    // temp order req body 
    const tempBodyCarts: [{cartid: number}] = [
        {
            cartid: tempAddCart1.body.data.cartid
        }
    ]
    const tempBodyPhoneNumber: number = 9804080343

    const reqBody = await request(app)
      .post('/api/orders/place-order/offline')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        carts: tempBodyCarts,
        phone_number: tempBodyPhoneNumber
      })

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.userid).toEqual(tempAddCart1.body.data.userid)
    expect(reqBody.body.data.phone_number).toEqual(String(tempBodyPhoneNumber))
    expect(reqBody.body.data.ordered_books).toBeDefined()
    expect(reqBody.body.data.ordered_books[0].bookid).toEqual(tempAddCart1.body.data.bookid)
    expect(reqBody.body.data.total_amount).toEqual(tempAddCart1.body.data.total_price)
    expect(reqBody.body.data.payment_status).toBe('unpaid')
    expect(reqBody.body.data.payment_method).toBe('cash_on_delivery')
  })

  it('Should not place order (cash-on-delivery) for incorrect body array of object cartids and body phone number', async () => {
    // temp add books
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })

    // temp add carts
    const tempAddCart1 = await request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        bookid: parseInt(tempAddBook1.body.data.bookid),
        quantity: 1
      })

    // temp order req body 
    const tempBodyCarts: [{cartid: number}] = [
        {
            cartid: 3898923853
        }
    ]
    const tempBodyPhoneNumber: number = 9804080343

    const reqBody = await request(app)
      .post('/api/orders/place-order/offline')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        carts: tempBodyCarts,
        phone_number: tempBodyPhoneNumber
      })

    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })

  it('Should not place order (cash-on-delivery) for correct body array of object cartids and incorrect body phone number', async () => {
    // temp add books
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })

    // temp add carts
    const tempAddCart1 = await request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        bookid: parseInt(tempAddBook1.body.data.bookid),
        quantity: 1
      })

    // temp order req body 
    const tempBodyCarts: [{cartid: number}] = [
        {
            cartid: 3898923853
        }
    ]
    const tempBodyPhoneNumber: number = 9804080343234

    const reqBody = await request(app)
      .post('/api/orders/place-order/offline')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        carts: tempBodyCarts,
        phone_number: tempBodyPhoneNumber
      })

    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })

  it('Should not place order (cash-on-delivery) for correct body array of object cartids and body phone number for unauthorized user', async () => {
    // temp add books
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })

    // temp add carts
    const tempAddCart1 = await request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        bookid: parseInt(tempAddBook1.body.data.bookid),
        quantity: 1
      })

    // temp order req body 
    const tempBodyCarts: [{cartid: number}] = [
        {
            cartid: 3898923853
        }
    ]
    const tempBodyPhoneNumber: number = 9804080343

    const reqBody = await request(app)
      .post('/api/orders/place-order/offline')
      .set('Authorization', 'Bearer ' + 'invalid jwt')
      .send({
        carts: tempBodyCarts,
        phone_number: tempBodyPhoneNumber
      })

    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.data).toBeUndefined()
  })

  it('Should place order (card) for correct body array of object cartids and body phone number', async () => {
    // temp add books
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })

    // temp add carts
    const tempAddCart1 = await request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        bookid: parseInt(tempAddBook1.body.data.bookid),
        quantity: 1
      })

    // temp order req body 
    const tempBodyCarts: [{cartid: number}] = [
        {
            cartid: tempAddCart1.body.data.cartid
        }
    ]
    const tempBodyPhoneNumber: number = 9804080343
    const tempBodyCardDetails = {
        'creditCard': '4242424242424242',
        'expMonth': 11,
        'expYear': 2023,
        'cvc': '123'
    }

    const reqBody = await request(app)
      .post('/api/orders/place-order/online')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        carts: tempBodyCarts,
        phone_number: tempBodyPhoneNumber,
        card_details: tempBodyCardDetails
      })

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.userid).toEqual(tempAddCart1.body.data.userid)
    expect(reqBody.body.data.phone_number).toEqual(String(tempBodyPhoneNumber))
    expect(reqBody.body.data.ordered_books).toBeDefined()
    expect(reqBody.body.data.ordered_books[0].bookid).toEqual(tempAddCart1.body.data.bookid)
    expect(reqBody.body.data.total_amount).toEqual(tempAddCart1.body.data.total_price)
    expect(reqBody.body.data.payment_status).toBe('paid')
    expect(reqBody.body.data.payment_method).toBe('card')
  })

  it('Should not place order (card) for incorrect body array of object cartids and body phone number', async () => {
    // temp add books
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })

    // temp add carts
    const tempAddCart1 = await request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        bookid: parseInt(tempAddBook1.body.data.bookid),
        quantity: 1
      })

    // temp order req body 
    const tempBodyCarts: [{cartid: number}] = [
        {
            cartid: 3898923853
        }
    ]
    const tempBodyPhoneNumber: number = 9804080343
    const tempBodyCardDetails = {
        'creditCard': '4242424242424242',
        'expMonth': 11,
        'expYear': 2023,
        'cvc': '123'
    }

    const reqBody = await request(app)
      .post('/api/orders/place-order/online')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        carts: tempBodyCarts,
        phone_number: tempBodyPhoneNumber,
        card_details: tempBodyCardDetails
      })

    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })

  it('Should not place order (card) for correct body array of object cartids and incorrect body phone number', async () => {
    // temp add books
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })

    // temp add carts
    const tempAddCart1 = await request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        bookid: parseInt(tempAddBook1.body.data.bookid),
        quantity: 1
      })

    // temp order req body 
    const tempBodyCarts: [{cartid: number}] = [
        {
            cartid: 3898923853
        }
    ]
    const tempBodyPhoneNumber: number = 9804080343234
    const tempBodyCardDetails = {
        'creditCard': '4242424242424242',
        'expMonth': 11,
        'expYear': 2023,
        'cvc': '123'
    }

    const reqBody = await request(app)
      .post('/api/orders/place-order/online')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        carts: tempBodyCarts,
        phone_number: tempBodyPhoneNumber,
        card_details: tempBodyCardDetails
      })

    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })

  it('Should not place order (card) for correct body array of object cartids and body phone number for unauthorized user', async () => {
    // temp add books
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })

    // temp add carts
    const tempAddCart1 = await request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        bookid: parseInt(tempAddBook1.body.data.bookid),
        quantity: 1
      })

    // temp order req body 
    const tempBodyCarts: [{cartid: number}] = [
        {
            cartid: 3898923853
        }
    ]
    const tempBodyPhoneNumber: number = 9804080343
    const tempBodyCardDetails = {
        'creditCard': '4242424242424242',
        'expMonth': 11,
        'expYear': 2023,
        'cvc': '123'
    }

    const reqBody = await request(app)
      .post('/api/orders/place-order/online')
      .set('Authorization', 'Bearer ' + 'invalid jwt')
      .send({
        carts: tempBodyCarts,
        phone_number: tempBodyPhoneNumber,
        card_details: tempBodyCardDetails
      })

    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.data).toBeUndefined()
  })

  it('Should confirm user orders for authorized admin user', async () => {
    // temp add books
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })

    // temp add carts
    const tempAddCart1 = await request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        bookid: parseInt(tempAddBook1.body.data.bookid),
        quantity: 1
      })

    // temp order req body 
    const tempBodyCarts: [{cartid: number}] = [
        {
            cartid: tempAddCart1.body.data.cartid
        }
    ]
    const tempBodyPhoneNumber: number = 9804080343

    const tempAddOrder = await request(app)
      .post('/api/orders/place-order/offline')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        carts: tempBodyCarts,
        phone_number: tempBodyPhoneNumber
      })

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/api/orders/confirm-order/${tempAddOrder.body.data.orderid}`)
      .set('Authorization', `Bearer ${tempAdminJWT}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.orderid).toEqual(tempAddOrder.body.data.orderid)
    expect(reqBody.body.data.payment_status).toEqual('paid')
    expect(reqBody.body.data.payment_method).toBe('cash_on_delivery')
  })

  it('Should not confirm user orders for incorrect param orderid for authorized admin user', async () => {
    // temp add books
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })

    // temp add carts
    const tempAddCart1 = await request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        bookid: parseInt(tempAddBook1.body.data.bookid),
        quantity: 1
      })

    // temp order req body 
    const tempBodyCarts: [{cartid: number}] = [
        {
            cartid: tempAddCart1.body.data.cartid
        }
    ]
    const tempBodyPhoneNumber: number = 9804080343

    const tempAddOrder = await request(app)
      .post('/api/orders/place-order/offline')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        carts: tempBodyCarts,
        phone_number: tempBodyPhoneNumber
      })

    const reqBody = await request(app)
      .get('/api/orders/confirm-order/invalidOrderid')
      .set('Authorization', `Bearer ${tempAdminJWT}`)

    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()

  })

  it('Should not confirm user orders which is already paid online for correct param orderid for authorized admin user', async () => {
    // temp add books
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })

    // temp add carts
    const tempAddCart1 = await request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        bookid: parseInt(tempAddBook1.body.data.bookid),
        quantity: 1
      })

    // temp order req body 
    const tempBodyCarts: [{cartid: number}] = [
        {
            cartid: tempAddCart1.body.data.cartid
        }
    ]
    const tempBodyPhoneNumber: number = 9804080343
    const tempBodyCardDetails = {
        'creditCard': '4242424242424242',
        'expMonth': 11,
        'expYear': 2023,
        'cvc': '123'
    }

    const tempAddOrder = await request(app)
      .post('/api/orders/place-order/online')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        carts: tempBodyCarts,
        phone_number: tempBodyPhoneNumber,
        card_details: tempBodyCardDetails
      })

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/api/orders/confirm-order/${tempAddOrder.body.data.orderid}`)
      .set('Authorization', `Bearer ${tempAdminJWT}`)

    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()

  })

  it('Should not confirm user orders for correct param orderid for unauthorized admin user', async () => {
    // temp add books
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })

    // temp add carts
    const tempAddCart1 = await request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        bookid: parseInt(tempAddBook1.body.data.bookid),
        quantity: 1
      })

    // temp order req body 
    const tempBodyCarts: [{cartid: number}] = [
        {
            cartid: tempAddCart1.body.data.cartid
        }
    ]
    const tempBodyPhoneNumber: number = 9804080343

    const tempAddOrder = await request(app)
      .post('/api/orders/place-order/offline')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        carts: tempBodyCarts,
        phone_number: tempBodyPhoneNumber
      })

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/api/orders/confirm-order/${tempAddOrder.body.data.orderid}`)
      .set('Authorization', 'Bearer ' + 'invalidjwt')

    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.data).toBeUndefined()

  })

  it('Should return user orders for authorized user', async () => {
    // temp add books
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })

    // temp add carts
    const tempAddCart1 = await request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        bookid: parseInt(tempAddBook1.body.data.bookid),
        quantity: 1
      })

    // temp order req body 
    const tempBodyCarts: [{cartid: number}] = [
        {
            cartid: tempAddCart1.body.data.cartid
        }
    ]
    const tempBodyPhoneNumber: number = 9804080343
    const tempBodyCardDetails = {
        'creditCard': '4242424242424242',
        'expMonth': 11,
        'expYear': 2023,
        'cvc': '123'
    }

    const tempAddOrder = await request(app)
      .post('/api/orders/place-order/online')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        carts: tempBodyCarts,
        phone_number: tempBodyPhoneNumber,
        card_details: tempBodyCardDetails
      })

    const reqBody = await request(app)
      .get('/api/orders/my-orders')
      .set('Authorization', `Bearer ${tempJwt}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.length).toEqual(1)
    expect(reqBody.body.data[0].orderid).toEqual(tempAddOrder.body.data.orderid)
  })

  it('Should not return user orders for unauthorized user', async () => {
    // temp add books
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })

    // temp add carts
    const tempAddCart1 = await request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        bookid: parseInt(tempAddBook1.body.data.bookid),
        quantity: 1
      })

    // temp order req body 
    const tempBodyCarts: [{cartid: number}] = [
        {
            cartid: tempAddCart1.body.data.cartid
        }
    ]
    const tempBodyPhoneNumber: number = 9804080343
    const tempBodyCardDetails = {
        'creditCard': '4242424242424242',
        'expMonth': 11,
        'expYear': 2023,
        'cvc': '123'
    }

    const tempAddOrder = await request(app)
      .post('/api/orders/place-order/online')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        carts: tempBodyCarts,
        phone_number: tempBodyPhoneNumber,
        card_details: tempBodyCardDetails
      })

    const reqBody = await request(app)
      .get('/api/orders/my-orders')
      .set('Authorization', 'Bearer ' + 'invalidjwt')

    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.data).toBeUndefined()
  })

  it('Should remove user orders for authorized admin user', async () => {
    // temp add books
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })

    // temp add carts
    const tempAddCart1 = await request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        bookid: parseInt(tempAddBook1.body.data.bookid),
        quantity: 1
      })

    // temp order req body 
    const tempBodyCarts: [{cartid: number}] = [
        {
            cartid: tempAddCart1.body.data.cartid
        }
    ]
    const tempBodyPhoneNumber: number = 9804080343
    const tempBodyCardDetails = {
        'creditCard': '4242424242424242',
        'expMonth': 11,
        'expYear': 2023,
        'cvc': '123'
    }

    const tempAddOrder = await request(app)
      .post('/api/orders/place-order/online')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        carts: tempBodyCarts,
        phone_number: tempBodyPhoneNumber,
        card_details: tempBodyCardDetails
      })

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .delete(`/api/orders/${tempAddOrder.body.data.orderid}`)
      .set('Authorization', `Bearer ${tempAdminJWT}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.orderid).toEqual(tempAddOrder.body.data.orderid)
  })

  it('Should not remove user orders for unauthorized admin user', async () => {
    // temp add books
    const tempAddBook1 = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${tempAdminJWT}`)
      .send({
        ...tempBookPayload1
      })

    // temp add carts
    const tempAddCart1 = await request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        bookid: parseInt(tempAddBook1.body.data.bookid),
        quantity: 1
      })

    // temp order req body 
    const tempBodyCarts: [{cartid: number}] = [
        {
            cartid: tempAddCart1.body.data.cartid
        }
    ]
    const tempBodyPhoneNumber: number = 9804080343
    const tempBodyCardDetails = {
        'creditCard': '4242424242424242',
        'expMonth': 11,
        'expYear': 2023,
        'cvc': '123'
    }

    const tempAddOrder = await request(app)
      .post('/api/orders/place-order/online')
      .set('Authorization', `Bearer ${tempJwt}`)
      .send({
        carts: tempBodyCarts,
        phone_number: tempBodyPhoneNumber,
        card_details: tempBodyCardDetails
      })

    const reqBody = await request(app)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .delete(`/api/orders/${tempAddOrder.body.data.orderid}`)
      .set('Authorization', 'Bearer ' + 'invalidjwt')

    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.data).toBeUndefined()

  })

  // clear all temporary datas
  afterEach(async () => {
    // clear cart
    await db.query('DELETE FROM carts WHERE carts.userid = $1', [currUserId])
    // clear orders
    await db.query('DELETE FROM orders WHERE orders.userid = $1', [currUserId])
    // clear book reivews
    await db.query('DELETE FROM reviews WHERE reviews.userid = $1', [currUserId])
    // clear customer user
    await db.query('DELETE FROM users WHERE users.userid = $1', [currUserId])
    // clear admin user
    await db.query('DELETE FROM users WHERE users.userid = $1', [tempAdminUserid])
    // clear book
    await db.query('DELETE FROM books WHERE books.title = $1 AND books.isbn = $2', [
      tempBookPayload1.title,
      tempBookPayload1.isbn
    ])
    await db.query('DELETE FROM books WHERE books.title = $1 AND books.isbn = $2', [
      tempBookPayload2.title,
      tempBookPayload2.isbn
    ])
    // clear author
    await db.query('DELETE FROM authors WHERE authors.firstname = $1 AND authors.lastname = $2', [
      tempBookPayload1.authorFirstname,
      tempBookPayload1.authorLastname
    ])
    await db.query('DELETE FROM authors WHERE authors.firstname = $1 AND authors.lastname = $2', [
      tempBookPayload2.authorFirstname,
      tempBookPayload2.authorLastname
    ])
    // clear genre
    await db.query('DELETE FROM genres WHERE genres.genre_name ILIKE $1', [tempBookPayload1.genre])
    await db.query('DELETE FROM genres WHERE genres.genre_name ILIKE $1', [tempBookPayload2.genre])
    tempJwt = ''
    currUserId = 0
  })

  // close db
  afterAll(async () => {
    await db.end()
  })
})