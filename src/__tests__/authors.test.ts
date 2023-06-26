import request from 'supertest'
import { genSalt,hash } from 'bcrypt'
import { db } from '../configs/db.configs'
import app from '../index'
import { type Iuser } from '../types'
import { capitalize } from '../controllers/authors.controller'

describe('Testing book authors routes', () => {
    // temp author payload
    const tempBookAuthorPayload1 = {
        firstname: 'testing',
        lastname: 'author'
    }

    const tempBookAuthorPayload2 = {
        firstname: 'testing2',
        lastname: 'author2'
    }

    // current temp book author ids
    let currentBookAuthorId1: number
    let currentBookAuthorId2: number

    // assign for post and patch
    const tempFirstname: string = 'testing30928349023'
    const tempLastname: string = 'author449083240'

    // assign temporary user
  const tempAdminUser: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: 'testing2',
    email: 'testing2@gmail.com',
    password: 'testing3'
  }

  // temporary jwttoken
  let tempAdminJwt: string

  // temporary userid
  let currAdminUserId: number

    beforeEach(async() => {
        // add temp book authors payload into db
        const tempAddBookAuthor1 = await db.query('INSERT INTO authors (firstname, lastname) VALUES ($1, $2) RETURNING *',[
            tempBookAuthorPayload1.firstname,
            tempBookAuthorPayload1.lastname
        ])
        const tempAddBookAuthor2 = await db.query('INSERT INTO authors (firstname, lastname) VALUES ($1, $2) RETURNING *',[
            tempBookAuthorPayload2.firstname,
            tempBookAuthorPayload2.lastname
        ])

        currentBookAuthorId1 = tempAddBookAuthor1.rows[0].authorid
        currentBookAuthorId2 = tempAddBookAuthor2.rows[0].authorid

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

    it('Should get all book authors without any queries',async () => {
        const reqBody = await request(app)
            .get('/authors')
            
        expect(reqBody.statusCode).toBe(200)
        expect(reqBody.body.success).toBeTruthy()
        expect(reqBody.body.data).toBeDefined()
        expect(reqBody.body.data.pagination).toBeDefined()
        expect(reqBody.body.data.results).toBeDefined()
    })

    it('Should get all book authors for correct query page and correct query size',async () => {
        const tempPage: number = 1
        const tempSize: number = 1

        const reqBody = await request(app)
            // eslint-disable-next-line quotes
            .get(`/authors?page=${tempPage}&size=${tempSize}`)
            
        expect(reqBody.statusCode).toBe(200)
        expect(reqBody.body.success).toBeTruthy()
        expect(reqBody.body.data).toBeDefined()
        expect(reqBody.body.data.pagination).toBeDefined()
        expect(reqBody.body.data.pagination.current_page).toEqual(tempPage)
        expect(reqBody.body.data.results).toBeDefined()
    })

    it('Should not get all book authors for incorrect page query',async () => {
        const tempPage: string = 'invalidPage'
        const tempSize: number = 1

        const reqBody = await request(app)
            .get(`/authors?page=${tempPage}&size=${tempSize}`)
            
        expect(reqBody.statusCode).toBe(403)
        expect(reqBody.body.data).toBeUndefined()
    })

    it('Should not get all book authors for incorrect size query',async () => {
        const tempPage: number = 1
        const tempSize: string = 'invalidSize'

        const reqBody = await request(app)
            .get(`/authors?page=${tempPage}&size=${tempSize}`)
            
        expect(reqBody.statusCode).toBe(403)
        expect(reqBody.body.data).toBeUndefined()
    })

    it('Should add new book authors for correct body firstname and correct body lastname for authorized admin user', async() => {
        const reqBody = await request(app)
            .post('/authors')
            .set('Authorization', 'Bearer ' + tempAdminJwt)
            .send({
                firstname: tempFirstname,
                lastname: tempLastname
            })

        expect(reqBody.statusCode).toBe(200)
        expect(reqBody.body.data).toBeDefined()
        expect(reqBody.body.data.authorid).toBeDefined()
        expect(reqBody.body.data.firstname).toEqual(capitalize(String(tempFirstname).toLowerCase()))
        expect(reqBody.body.data.lastname).toEqual(capitalize(String(tempLastname).toLowerCase()))
    })

    it('Should not add new book authors for incorrect body firstname and correct body lastname for authorized admin user', async() => {
        const reqBody = await request(app)
            .post('/authors')
            .set('Authorization', 'Bearer ' + tempAdminJwt)
            .send({
                firstname: 123,
                lastname: tempLastname
            })

        expect(reqBody.statusCode).toBe(403)
        expect(reqBody.body.data).toBeUndefined()
    })

    it('Should not add new book authors for correct body firstname and incorrect body lastname for authorized admin user', async() => {
        const reqBody = await request(app)
            .post('/authors')
            .set('Authorization', 'Bearer ' + tempAdminJwt)
            .send({
                firstname: tempFirstname,
                lastname: 123
            })

        expect(reqBody.statusCode).toBe(403)
        expect(reqBody.body.data).toBeUndefined()
    })

    it('Should not add new book authors for no body firstname and correct body lastname for authorized admin user', async() => {
        const reqBody = await request(app)
            .post('/authors')
            .set('Authorization', 'Bearer ' + tempAdminJwt)
            .send({
                lastname: tempLastname
            })

        expect(reqBody.statusCode).toBe(403)
        expect(reqBody.body.data).toBeUndefined()
    })

    it('Should not add new book authors for correct body firstname and no body lastname for authorized admin user', async() => {
        const reqBody = await request(app)
            .post('/authors')
            .set('Authorization', 'Bearer ' + tempAdminJwt)
            .send({
                firstname: tempFirstname
            })

        expect(reqBody.statusCode).toBe(403)
        expect(reqBody.body.data).toBeUndefined()
    })

    it('Should not add new book authors for correct body firstname and correct body lastname for unauthorized admin user', async() => {
        const reqBody = await request(app)
            .post('/authors')
            .set('Authorization', 'Bearer ' + 'invalidAdminJWT')
            .send({
                firstname: tempFirstname,
                lastname: tempLastname
            })

        expect(reqBody.statusCode).toBe(401)
        expect(reqBody.body.success).toBeFalsy()
        expect(reqBody.body.data).toBeUndefined()
    })

    afterEach(async() => {
        // clear book authors
        await db.query('DELETE FROM authors WHERE authors.authorid = $1',[currentBookAuthorId1])
        await db.query('DELETE FROM authors WHERE authors.authorid = $1',[currentBookAuthorId2])
        await db.query('DELETE FROM authors WHERE authors.firstname = $1 AND authors.lastname = $2',[
            capitalize(String(tempFirstname).toLowerCase()),
            capitalize(String(tempLastname).toLowerCase())
        ])
        // clear admin user
        await db.query('DELETE FROM users WHERE users.userid = $1',[currAdminUserId])
        currentBookAuthorId1 = 0
        currentBookAuthorId2 = 0
        tempAdminJwt = ''
        currAdminUserId = 0
    })

    afterAll(async() => {
        // end db
        await db.end()
    })
})