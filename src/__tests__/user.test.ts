import request from 'supertest'
import app from '../index'
import { type Iuser } from '../types'
import { genSalt, hash } from 'bcrypt'
import { db } from '../configs/db.configs'

describe('Testing user route for logic in user info', () => {
  // assign temporary user
  const tempUser: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: 'testing2',
    email: 'testing2@gmail.com',
    password: 'testing3'
  }

  // temporary jwttoken
  let tempJwt: string

  // temporary userid
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

  it('Should get correct userdata for authenticated user', async () => {
    const reqBody = await request(app)
      .get('/user')
      .set('Authorization', 'Bearer ' + tempJwt)
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.userid).toEqual(currUserId)
    expect(reqBody.body.data.email).toEqual(tempUser.email)
    expect(reqBody.body.data.username).toEqual(tempUser.username)
  })

  // clear all temporary datas
  afterEach(async () => {
    await db.query(`DELETE FROM users WHERE users.userid = $1`, [currUserId])
    tempJwt = ''
    currUserId = 0
  })

  // close db
  afterAll(async () => {
    await db.end()
  })
})
