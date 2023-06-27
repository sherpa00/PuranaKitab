/* eslint-disable quotes */
import request from 'supertest'
import { hash, genSalt } from 'bcrypt'
import app from '../../index'
import { db } from '../../configs/db.configs'
import { type Iuser } from '../../types'
import { capitalize } from '../../controllers/authors.controller'


describe('Testing book genres routes', () => {

    // temp genres payload
    const tempGenresPayload1 = {
        genre_name: '293480923testing123094328'
    }

    const tempGenresPayload2 = {
        genre_name: '384989893729479testing248903280'
    }

  // assign temporary user
  const tempAdminUser: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: 'testing2',
    email: 'testing2409382094832@gmail.com',
    password: 'testing3'
  }

  // temporary jwttoken
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let tempAdminJwt: string

  // temporary userid
  let currAdminUserId: number

  beforeEach(async () => {
    // add temp admin user
    // assining jwt and id for admin user
    const tempAdminSalt = await genSalt(10)
    const tempAdminHashedPassword = await hash(tempAdminUser.password, tempAdminSalt)

    await db.query('INSERT INTO users (username,password,salt,email,role) VALUES ($1,$2,$3,$4,$5)', [
      tempAdminUser.username,
      tempAdminHashedPassword,
      tempAdminSalt,
      tempAdminUser.email,
      'ADMIN'
    ])

    const loginAdminResponse = await request(app).post('/login').send({
      email: tempAdminUser.email,
      password: tempAdminUser.password
    })

    tempAdminJwt = loginAdminResponse.body.token

    currAdminUserId = loginAdminResponse.body.data.userid
  })

  it('Should get all book genres without any quiries', async () => {
    // add genres by db
    await db.query('INSERT INTO genres (genre_name) VALUES ($1)',[tempGenresPayload1.genre_name])
    await db.query('INSERT INTO genres (genre_name) VALUES ($1)',[tempGenresPayload2.genre_name])

    const reqBody = await request(app)
        .get('/genres')
    
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.pagination).toBeDefined()
    expect(reqBody.body.data.results).toBeDefined()
    expect(reqBody.body.data.results.length).toEqual(Number(reqBody.body.data.pagination.total_results))
  })

  it('Should get all book genres with correct page query and correct size query', async () => {
    // add genres by db
    await db.query('INSERT INTO genres (genre_name) VALUES ($1)',[tempGenresPayload1.genre_name])
    await db.query('INSERT INTO genres (genre_name) VALUES ($1)',[tempGenresPayload2.genre_name])

    // temp req queries
    const tempPage: number = 1
    const tempSize: number = 2
    
    const reqBody = await request(app)
        .get(`/genres?page=${tempPage}&size=${tempSize}`)
    
    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.pagination).toBeDefined()
    expect(reqBody.body.data.results).toBeDefined()
    expect(reqBody.body.data.results.length).toBeLessThanOrEqual(tempSize)
  })

  it('Should not get all book genres for incorrect query page and correct query size', async () => {
    // add genres by db
    await db.query('INSERT INTO genres (genre_name) VALUES ($1)',[tempGenresPayload1.genre_name])
    await db.query('INSERT INTO genres (genre_name) VALUES ($1)',[tempGenresPayload2.genre_name])

    const tempPage: string = 'invalidpage'
    const tempSize: number = 2
    
    const reqBody = await request(app)
        .get(`/genres?page=${tempPage}&size=${tempSize}`)
    
    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })

  it('Should not get all book genres for correct query page and incorrect query size', async () => {
    // add genres by db
    await db.query('INSERT INTO genres (genre_name) VALUES ($1)',[tempGenresPayload1.genre_name])
    await db.query('INSERT INTO genres (genre_name) VALUES ($1)',[tempGenresPayload2.genre_name])

    const tempPage: number = 1
    const tempSize: string = 'invalidsize'
    
    const reqBody = await request(app)
        .get(`/genres?page=${tempPage}&size=${tempSize}`)
    
    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })

  it('Should add new book genre with correct body genre name for authorized admin user', async () => {

    const reqBody = await request(app)
        .post('/genres')
        .set('Authorization', 'Bearer ' + tempAdminJwt)
        .send({
            genre: tempGenresPayload1.genre_name
        })

    expect(reqBody.statusCode).toBe(200)
    expect(reqBody.body.success).toBeTruthy()
    expect(reqBody.body.data).toBeDefined()
    expect(reqBody.body.data.genre_name).toEqual(capitalize(tempGenresPayload1.genre_name))
  })

  it('Should not add new book genre with incorrect body genre name for authorized admin user', async () => {

    const reqBody = await request(app)
        .post('/genres')
        .set('Authorization', 'Bearer ' + tempAdminJwt)
        .send({
            genre: 13439492
        })

    expect(reqBody.statusCode).toBe(403)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })

  it('Should not add new book genre having already existed genre with correct body genre name for authorized admin user', async () => {
    // add temp genre
    await db.query('INSERT INTO genres (genre_name) VALUES ($1)',[tempGenresPayload1.genre_name])

    const reqBody = await request(app)
        .post('/genres')
        .set('Authorization', 'Bearer ' + tempAdminJwt)
        .send({
            genre: tempGenresPayload1.genre_name
        })

    expect(reqBody.statusCode).toBe(400)
    expect(reqBody.body.success).toBeFalsy()
    expect(reqBody.body.data).toBeUndefined()
  })

  it('Should not add new book genre with correct body genre name for unauthorized admin user', async () => {

    const reqBody = await request(app)
        .post('/genres')
        .set('Authorization', 'Bearer ' + 'invalidJWT')
        .send({
            genre: tempGenresPayload1.genre_name
        })

    expect(reqBody.statusCode).toBe(401)
    expect(reqBody.body.data).toBeUndefined()
  })

  afterEach(async() => {
    // clear book genres
    await db.query('DELETE FROM genres WHERE genres.genre_name = $1',[tempGenresPayload1.genre_name])
    await db.query('DELETE FROM genres WHERE genres.genre_name = $1',[tempGenresPayload2.genre_name])
    // clear admin user
    await db.query('DELETE FROM users WHERE users.userid = $1', [currAdminUserId])
    tempAdminJwt = ''
    currAdminUserId = 0
  })

  afterAll(async() => {
    await db.end()
  })
})