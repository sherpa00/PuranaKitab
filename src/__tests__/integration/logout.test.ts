import request from 'supertest'
import { genSalt, hash } from 'bcrypt'
import app from '../../index'
import { type Iuser } from '../../types'
import { db } from '../../configs/db.configs'
import logger from '../../utils/logger.utils'
import { faker } from '@faker-js/faker'

describe('Testing for Login and Register routes', () => {
  // asssing new userdata
  const tempUserData: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }

  let tempUserid: number

  let tempJWT: string

  beforeEach(async () => {
    const tempSalt = await genSalt(10)
    const tempHashedPassword = await hash(tempUserData.password, tempSalt)

    await db.query('INSERT INTO users (username,password,salt,email,role) VALUES ($1,$2,$3,$4,$5)', [
      tempUserData.username,
      tempHashedPassword,
      tempSalt,
      tempUserData.email,
      'CUSTOMER'
    ])

    const loginResponse = await request(app).post('/api/login').send({
      email: tempUserData.email,
      password: tempUserData.password
    })

    tempJWT = loginResponse.body.token

    tempUserid = loginResponse.body.data.userid
  })

  it('Should return success when logging out user for authorized user', async () => {
    const reqBody = await request(app).get('/api/logout').set('Authorization', `Bearer ${tempJWT}`)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
  })

  it('Should not log out when logging out for unauthorized user', async () => {
    const reqBody = await request(app)
      .get('/api/logout')
      .set('Authorization', 'Bearer ' + 'invalidJWT')

    expect(reqBody.statusCode).toBe(401)
  })

  afterEach(async () => {
    await db.query('DELETE FROM users where users.userid = $1', [tempUserid])
  })

  afterAll(async () => {
    try {
      await db.end()
    } catch (err) {
      logger.error(err, 'Error while ending db in signup and login routes test')
    }
  })
})
