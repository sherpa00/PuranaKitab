
import request from 'supertest'
import app from '../index'
import { type Iuser } from '../types'
import { genSalt, hash } from 'bcrypt'
import { db } from '../configs/db.configs'

describe('Testing the private route', () => {
  // assing temp user
  const tempUser: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: 'testing1',
    email: 'testgin1@gmail.com',
    password: 'testing1'
  }

  // global jwt token space
  let jwtToken: string

  // global current userid
  let currUserId: number

  // asssign token
  beforeEach(async () => {
    const tempSalt = await genSalt(10)
    const tempHashedPassword = await hash(tempUser.password, tempSalt)

    await db.query(
      'INSERT INTO users (username,password,salt,email) VALUES ($1,$2,$3,$4)',
      [tempUser.username, tempHashedPassword, tempSalt, tempUser.email]
    )

    const loginResponse = await request(app).post('/login').send({
      email: tempUser.email,
      password: tempUser.password
    })

    // save token for later use
    jwtToken = loginResponse.body.token

    // save the current userid for later use
    currUserId = loginResponse.body.data.userid
  })

  // TESTING AUTHENTICATE SUCCESS WITH CORRECT TOKEN
  it('Should get return success for correct jwt token', async () => {
    const reqBody = await request(app)
      .get('/private')
      .set('Authorization', 'Bearer ' + jwtToken)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.userid).toBe(currUserId)
  })

  // TESTING AUTHENTICATE ERROR WITH INCORRECT TOKEN
  it('Should get return failure for incorrect jwt token', async () => {
    const reqBody = await request(app)
      .get('/private')
      .set('Authorization', 'Bearer ' + 'somewrongtoken')

    expect(reqBody.statusCode).toBe(401)
  })

  afterEach(async () => {
    await db.query('DELETE FROM users WHERE users.userid = $1', [currUserId])
    jwtToken = ''
    currUserId = 0
  })

  afterAll(async function () {
    await db.end()
  })
})

