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

  it('Should update username for authenticated user', async () => {
    const tempNewUsername: string = 'newTesting2'

    const reqBody = await request(app)
      .patch('/user/username')
      .set('Authorization', 'Bearer ' + tempJwt)
      .send({
        newusername: tempNewUsername
      })
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.userid).toEqual(currUserId)
    expect(reqBody.body.data.email).toEqual(tempUser.email)
    expect(reqBody.body.data.username).toEqual(tempNewUsername)
  })

  it('Should not update username for unauthenticated user', async () => {
    const tempNewUsername: string = 'newTesting2'

    const reqBody = await request(app)
      .patch('/user/username')
      .set('Authorization', 'Bearer ' + 'wrongjwttoken')
      .send({
        newusername: tempNewUsername
      })
    expect(reqBody.statusCode).toBe(401)
  })

  it('Should update email for authenticated user', async () => {
    const tempNewEmail: string = 'newTesting2@gmail.com'

    const reqBody = await request(app)
      .patch('/user/email')
      .set('Authorization', 'Bearer ' + tempJwt)
      .send({
        newemail: tempNewEmail
      })
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.userid).toEqual(currUserId)
    expect(reqBody.body.data.username).toEqual(tempUser.username)
    expect(reqBody.body.data.email).toEqual(tempNewEmail)
  })

  it('Should not update email for unauthenticated user', async () => {
    const tempNewEmail: string = 'newTesting2@gmail.com'

    const reqBody = await request(app)
      .patch('/user/email')
      .set('Authorization', 'Bearer ' + 'wrongjwttoken')
      .send({
        newemail: tempNewEmail
      })
    expect(reqBody.statusCode).toBe(401)
  })

  it('Should update password for authorized user with correct password', async () => {
    const tempNewPassword: string = 'newTestingPassword'

    const reqBody = await request(app)
      .patch('/user/password')
      .set('Authorization', 'Bearer ' + tempJwt)
      .send({
        oldpassword: tempUser.password,
        newpassword: tempNewPassword
      })
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.userid).toEqual(currUserId)
  })

  it('Should not update password for authorized user with incorrect password', async () => {
    const tempNewPassword: string = 'newTestingPassword'

    const reqBody = await request(app)
      .patch('/user/password')
      .set('Authorization', 'Bearer ' + tempJwt)
      .send({
        oldpassword: 'IncorrectPassword',
        newpassword: tempNewPassword
      })
    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should not update password for unauthorized user with correct password', async () => {
    const tempNewPassword: string = 'newTestingPassword'

    const reqBody = await request(app)
      .patch('/user/password')
      .set('Authorization', 'Bearer ' + 'invalidJWT')
      .send({
        oldpassword: tempUser.password,
        newpassword: tempNewPassword
      })
    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should delete user account for authorized user with correct password', async () => {
    const reqBody = await request(app)
      .delete('/user')
      .set('Authorization', 'Bearer ' + tempJwt)
      .send({
        password: tempUser.password
      })
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data.userid).toEqual(currUserId)
  })

  it('Should not delete user account for authorized user with incorrect password', async () => {
    const reqBody = await request(app)
      .delete('/user')
      .set('Authorization', 'Bearer ' + tempJwt)
      .send({
        password: 'IncorrectPassword'
      })
    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should not delete user account for unauthorized user with correct password', async () => {
    const reqBody = await request(app)
      .delete('/user')
      .set('Authorization', 'Bearer ' + 'InvalidJWT')
      .send({
        password: tempUser.password
      })
    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.success).toBeFalsy()
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
