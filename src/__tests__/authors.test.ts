import request from 'supertest'
import { db } from '../configs/db.configs'
import app from '../index'

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

    beforeEach(async() => {
        // add temp book authors payload into db
        const tempAddBookAuthor1 = await db.query('INSERT INTO authors (firstname, lastname) VALUES ($1, $2) RETURNING *',[
            tempBookAuthorPayload1.firstname,
            tempBookAuthorPayload1.lastname
        ])
        const tempAddBookAuthor2 = await db.query('INSERT INTO authors (firstname, lastname) VALUES ($1, $2) RETURNING *',[
            tempBookAuthorPayload1.firstname,
            tempBookAuthorPayload1.lastname
        ])

        currentBookAuthorId1 = tempAddBookAuthor1.rows[0].authorid
        currentBookAuthorId2 = tempAddBookAuthor2.rows[0].authorid
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

    afterEach(async() => {
        // clear book authors
        await db.query('DELETE FROM authors WHERE authors.authorid = $1',[currentBookAuthorId1])
        await db.query('DELETE FROM authors WHERE authors.authorid = $1',[currentBookAuthorId2])
        currentBookAuthorId1 = 0
        currentBookAuthorId2 = 0
    })

    afterAll(async() => {
        // end db
        await db.end()
    })
})