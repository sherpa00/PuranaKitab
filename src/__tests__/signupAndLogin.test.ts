import request from 'supertest'
import app from '../index'
import { type Iuser } from '../types'
import { db } from '../configs/db.configs'

describe('Testing for Login and Register routes', () => {
  // asssing new userdata
  const tempUserData: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: 'testing',
    email: 'testing@gmail.com',
    password: 'testing'
  }

  let tempUserid: number

  it('Should return success when registering new user', async () => {
    const reqBody = await request(app).post('/register').send(tempUserData)
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
  })

  it('Should return false whne registering with empty username', async () => {
    const reqBody = await request(app).post('/register').send({
      username: '',
      email: tempUserData.email,
      password: tempUserData.password
    })
    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should return false whne registering with empty email', async () => {
    const reqBody = await request(app).post('/register').send({
      username: tempUserData.username,
      email: '',
      password: tempUserData.password
    })
    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should return false whne registering with empty password', async () => {
    const reqBody = await request(app).post('/register').send({
      username: tempUserData.username,
      email: tempUserData.password,
      password: ''
    })
    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should return false whne registering with invalid email', async () => {
    const reqBody = await request(app).post('/register').send({
      username: tempUserData.username,
      email: 'incorrectEmail.com',
      password: tempUserData.password
    })
    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should return false whne registering with invalid password', async () => {
    const reqBody = await request(app).post('/register').send({
      username: tempUserData.username,
      email: tempUserData.email,
      password: "test" // length is only 4
    })
    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.errors[0].path).toBe('password');
  })

  it('Should return token when login in with correct data', async () => {
    const reqBody = await request(app).post('/login').send({
      email: tempUserData.email,
      password: tempUserData.password
    })
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.token.length).toBeGreaterThan(0)
    tempUserid = reqBody.body.data.userid
  })

  it('Should return false when loggin in with incorrect email', async () => {
    const reqBody = await request(app).post('/login').send({
      email: 'incorrect@gmail.com',
      password: tempUserData.password
    })
    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
  })

  it('Should return false when loggin in with incorrect password', async () => {
    const reqBody = await request(app).post('/login').send({
      email: tempUserData.email,
      password: 'incorrect'
    })
    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
  })

  afterAll(async () => {
    try {
      await db.query('DELETE FROM users where users.userid = $1', [tempUserid])
      await db.end()
    } catch (err) {
      console.log(err)
      console.log('Error while testing signup and login routes.')
    }
  })
})
