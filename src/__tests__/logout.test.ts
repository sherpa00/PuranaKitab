import request from 'supertest'
import app from '../index'
import { type Iuser } from '../types'
import { db } from '../configs/db.configs'
import { genSalt, hash } from 'bcrypt'

describe('Testing for Login and Register routes', () => {
  // asssing new userdata
  const tempUserData: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: 'testing7',
    email: 'testing7@gmail.com',
    password: 'testing7'
  }

  let tempUserid: number

  let tempJWT: string

  beforeEach(async () => {
    const tempSalt = await genSalt(10)
    const tempHashedPassword = await hash(tempUserData.password, tempSalt)

    await db.query(`INSERT INTO users (username,password,salt,email,role) VALUES ($1,$2,$3,$4,$5)`, [
      tempUserData.username,
      tempHashedPassword,
      tempSalt,
      tempUserData.email,
      'CUSTOMER'
    ])

    const loginResponse = await request(app).post('/login').send({
      email: tempUserData.email,
      password: tempUserData.password
    })

    tempJWT = loginResponse.body.token

    tempUserid = loginResponse.body.data.userid
  })

  it('Should return success when logging out user for authorized user', async () => {
    const reqBody = await request(app)
        .get('/logout')
        .set('Authorization', 'Bearer ' + tempJWT)
    
    const tempPrivateRoute = await request(app)
        .get('/private')
        .set('Authorization', 'Bearer ' + tempJWT)

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(tempPrivateRoute.statusCode).toBe(401)
  })

  it('Should not log out when logging out for unauthorized user', async () => {
    const reqBody = await request(app)
        .get('/logout')
        .set('Authorization', 'Bearer ' + 'invalidJWT')

    expect(reqBody.statusCode).toBe(401)
  })

  afterEach(async() => {
    await db.query('DELETE FROM users where users.userid = $1', [tempUserid])
  })

  afterAll(async () => {
    try {
      await db.end()
    } catch (err) {
      console.log(err)
      console.log('Error while testing signup and login routes.')
    }
  })
})