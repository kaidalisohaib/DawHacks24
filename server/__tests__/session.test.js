require('dotenv').config();
//wrapper around supertest to support sessions
const request = require('supertest-session'); 
//ensure mock is called before requiring app
const { csrfSync } = require('csrf-sync'); 
jest.mock('csrf-sync');
csrfSync.mockReturnValue( {
  generateToken: () => '12345',
  csrfSynchronisedProtection: (req, res, next) => next(),
});

//set the environment to test so that cookies are not secure
process.env.NODE_ENV = 'test';
const app = require('../app');

const { OAuth2Client } = require('google-auth-library');
jest.mock('google-auth-library');

const User = require('../models/User.js');
jest.mock('../models/User.js');

let session = null;
//session is a wrapper around supertest that supports sessions
beforeEach(function () {
  session = request(app);
});

describe('before login', () => {
//test suite with all test cases for unauthenticated users
  /*test('POST /auth: should return 401 if no token is provided', async () => {
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue(false);
    const response = await session.post('/auth').send({ hello: '' });
    expect(response.statusCode).toBe(401);
  });

  test('POST /auth: should return 401 if token is invalid', async () => {
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue(false);
    const response = await session.post('/auth').send({ token: '' });
    expect(response.statusCode).toBe(401);
  });*/

  test('GET /protected: should return 401 if no session exists', async () => {
    const response = await session.get('/auth/protected');
    expect(response.statusCode).toBe(401);
  });

  test('POST /logout: should return 401 if no session', async () => {
    const response = await session.post('/auth/logout');
    expect(response.statusCode).toBe(401);  
  });  

  test('POST /auth: should return 200 if session is created', async () => {
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue(
      {
        getPayload: function() {
          return {
            name: 'Jaya',
            email: 'Jaya.the.great@gmail.com',
            picture: 'unavailable'
          };
        }
      });
    jest.spyOn(User, 'findOne').mockResolvedValue(
      {
        name: 'Jaya',
        email: 'Jaya.the.great@gmail.com',
        profileImageURI: undefined   
      }
    );
    const response = await session.post('/auth/login').send({ token: 'hi' });
    expect(response.statusCode).toBe(200);
    expect(response.body.user.name).toBe('Jaya');
    expect(response.body.user.email).toBe('Jaya.the.great@gmail.com');
    expect(response.body.user.profileImageURI).toBe(undefined);
  });
});

describe('after successful login', () => {
  //test suite for authenticated users
  //fake login before each test
  beforeEach(async function () {
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue({
      getPayload: function() {
        return {
          name: 'Jaya',
          email: 'Jaya.the.great@gmail.com',
          picture: 'unavailable'
        };
      }
    });

    const response = await session.post('/auth/login').send({ token: 'hi' });
    expect(response.statusCode).toBe(200);
    //should have a session now
  });

  test('GET /protected: should return 200', async () => {
    const response = await session.get('/auth/protected');
    expect(response.statusCode).toBe(200);
  });

  test('POST /logout: should return 200', async () => {
    const response = await session.post('/auth/logout');
    expect(response.statusCode).toBe(200);  
  });  

  /*test('GET /csrf-token: should return 200 if session is created', async () => {
    const response = await session.get('/csrf-token');
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe('12345');
  });

  test('POST /formsubmit: should return 200 if is code matches', async () => {
    const response = await session.post('/formsubmit').send({ hello: '' });
    expect(response.statusCode).toBe(200);
  });*/
});
