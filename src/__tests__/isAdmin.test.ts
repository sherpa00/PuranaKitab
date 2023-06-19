import request from 'supertest';
import { genSalt, hash } from 'bcrypt';
import app from '../index';
import { type Iuser } from '../types';
import { db } from '../configs/db.configs';

describe('Testing for /isadmin route to showcase admin authorization', () => {
  // asssing new admin userdata
  const tempAdminUserData: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: 'testing1039289328409289423',
    email: 'testing18422030920@gmail.com',
    password: 'testing100554948290349032',
  };

  let tempAdminUserid: number;

  let tempAdminJWT: string;

  // asssing new customer userdata
  const tempCustomerUserData: Pick<Iuser, 'username' | 'email' | 'password'> = {
    username: 'testing194848322931',
    email: 'testing1983094380249021@gmail.com',
    password: 'testing12348329043201',
  };

  let tempCustomerUserid: number;

  let tempCustomerJWT: string;

  beforeEach(async () => {
    // assining jwt and id for admin user
    const tempAdminSalt = await genSalt(10);
    const tempAdminHashedPassword = await hash(tempAdminUserData.password, tempAdminSalt);

    await db.query('INSERT INTO users (username,password,salt,email,role) VALUES ($1,$2,$3,$4,$5)', [
      tempAdminUserData.username,
      tempAdminHashedPassword,
      tempAdminSalt,
      tempAdminUserData.email,
      'ADMIN',
    ]);

    const loginAdminResponse = await request(app).post('/login').send({
      email: tempAdminUserData.email,
      password: tempAdminUserData.password,
    });

    tempAdminJWT = loginAdminResponse.body.token;

    tempAdminUserid = loginAdminResponse.body.data.userid;

    // assigning jwt and id for customer user
    const tempCustomerSalt = await genSalt(10);
    const tempCustomerHashedPassword = await hash(tempCustomerUserData.password, tempCustomerSalt);

    await db.query('INSERT INTO users (username,password,salt,email,role) VALUES ($1,$2,$3,$4,$5)', [
      tempCustomerUserData.username,
      tempCustomerHashedPassword,
      tempCustomerSalt,
      tempCustomerUserData.email,
      'CUSTOMER',
    ]);

    const loginCustomerResponse = await request(app).post('/login').send({
      email: tempCustomerUserData.email,
      password: tempCustomerUserData.password,
    });

    tempCustomerJWT = loginCustomerResponse.body.token;

    tempCustomerUserid = loginCustomerResponse.body.data.userid;
  });

  it('Should return success for route /isadmin when using correct admin user token', async () => {
    const reqBody = await request(app)
      .get('/isadmin')
      .set('Authorization', `Bearer ${tempAdminJWT}`);

    expect(reqBody.statusCode).toBe(200);
    expect(reqBody.body.success).toBeTruthy();
  });

  it('Should return false for route /isadmin when using incorrect admin user token', async () => {
    const reqBody = await request(app)
      .get('/isadmin')
      .set('Authorization', 'Bearer ' + 'invalidAdminJWT');

    expect(reqBody.statusCode).toBe(401);
    expect(reqBody.body.success).toBeFalsy();
  });

  it('Should return false for route /isadmin when using correct customer user token', async () => {
    const reqBody = await request(app)
      .get('/isadmin')
      .set('Authorization', `Bearer ${tempCustomerJWT}`);

    expect(reqBody.statusCode).toBe(401);
    expect(reqBody.body.success).toBeFalsy();
  });

  afterEach(async () => {
    await db.query('DELETE FROM users WHERE userid = $1', [tempAdminUserid]);
    await db.query('DELETE FROM users WHERE userid = $1', [tempCustomerUserid]);
    tempAdminJWT = '';
    tempCustomerJWT = '';
    tempAdminUserid = 0;
    tempCustomerUserid = 0;
  });

  afterAll(async () => {
    await db.end();
  });
});
