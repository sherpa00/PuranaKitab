/*
import request from 'supertest'
import app from '../index'

describe('Testing the root route for api server aliveness', () => {
  it('Should return success true and success message', async () => {
    const reqBody = await request(app).get('/')
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.message).toBe('Api server is alive')
  })
})

*/