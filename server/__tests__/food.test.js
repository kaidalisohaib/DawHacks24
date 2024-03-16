require('dotenv').config();
const request = require('supertest');
process.env.NODE_ENV = 'test';
const { csrfSync } = require('csrf-sync'); 
jest.mock('csrf-sync');
csrfSync.mockReturnValue( {
  generateToken: () => '12345',
  csrfSynchronisedProtection: (req, res, next) => next(),
});

const app = require('../app');
const Food = require('../models/Food.js');
jest.mock('../models/Food.js');
//const User = require('../models/User.js');
jest.mock('../models/User.js');

//const { OAuth2Client } = require('google-auth-library');
jest.mock('google-auth-library');
/*
let session = null;
beforeEach(function () {
  session = request(app);
});
*/

describe('Test all endpoints of food api', () => {
  test('Test getting a specified food', async () => {
    jest.spyOn(Food, 'findOne').mockResolvedValue(
      {
        name: 'Fruit',
        protein: 1
      }
    );

    const response = await request(app).get(
      '/food-buds/api/v1/specific-food/Snacks%20Fruit%20Leather%20Pieces'
    );
    
    expect(response.statusCode).toBe(200);
    expect(response.body.data.name).toBe('Fruit');
    expect(response.body.data.protein.value).toBe(1);
  });

  //continue here - watch out for endpoints that need auhthentication
  test('Test getting All Foods from the DB', async () => {
    jest.spyOn(Food, 'find').mockResolvedValue(
      [
        {
          name: 'Fruit',
          protein: 20
        },
        {
          name: 'Steak',
          protein: 0
        },
        {
          name: 'Banana',
          protein: 50
        }
      ]
    );

    const response = await request(app).get('/food-buds/api/v1/all-foods');
    const nameArr = ['Fruit', 'Steak', 'Banana'];

    expect(response.statusCode).toBe(200);
    
    for (const [idx, food] of response.body.allFoods.entries()) {
      expect(food.name).toBe(nameArr[idx]);
    }
  });

  // Not working because of authentication problems
  /*
  test('Test getting all the custom food of a certain user', async () => {
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue(
      {
        getPayload: function() {
          return {
            name: 'Samir',
            email: 'samirturx@hotmail.com',
            picture: 'unavailable'
          };
        }
      }
    );
    jest.spyOn(User, 'findOne').mockResolvedValue(
      {
        name: 'Samir',
        email: 'samirturx@hotmail.com',
        profileImageURI: undefined
      }
    );
    jest.spyOn(Food, 'find').mockResolvedValue(
      [
        {
          name: 'Fruit',
          protein: 20
        },
        {
          name: 'Steak',
          protein: 0
        },
        {
          name: 'Banana',
          protein: 50
        }
      ]
    );
    const response = await session.get('/food-buds/api/v1/all-foods-custom');
    const nameArr = ['Fruit', 'Steak', 'Banana'];
    const proteinArr = [20, 0, 50];
    expect(response.statusCode).toBe(200);
    
    for (const [idx, food] of response.body.allFoods.entries()) {
      expect(food.name).toBe(nameArr[idx]);
      expect(food.protein).toBe(proteinArr[idx]);
    }
  });
  */

  test('Test getting multiple selected foods', async () => {
    const nameArr = ['Fruit', 'Steak', 'Banana'];

    for (const name of nameArr) {
      jest.spyOn(Food, 'findOne').mockResolvedValue(
        {
          name: name,
          protein: 20,
        }
      );
    }
    
    const response = await request(app).post('/food-buds/api/v1/total-foods').send(nameArr);

    expect(response.statusCode).toBe(200);
    expect(response.body.totalNutrition).toEqual(
      {
        'name': 'Total Nutrition',
        'calcium': {
          'value': null,
          'percent': null
        },
        'calories': {
          'value': null,
          'percent': null
        },
        'carbohydrate': {
          'value': null,
          'percent': null
        },
        'cholesterol': {
          'value': null,
          'percent': null
        },
        'fat': {
          'value': null,
          'percent': null
        },
        'fiber': {
          'value': null,
          'percent': null
        },
        'iron': {
          'value': null,
          'percent': null
        },
        'potassium': {
          'value': null,
          'percent': null
        },
        'protein': {
          'value': 60,
          'percent': 120
        },
        'sodium': {
          'value': null,
          'percent': null
        },
        'sugars': {
          'value': null,
          'percent': null
        },
        'vitaminA': {
          'value': null,
          'percent': null
        },
        'vitaminB12': {
          'value': null,
          'percent': null
        },
        'vitaminC': {
          'value': null,
          'percent': null
        },
        'vitaminD': {
          'value': null,
          'percent': null
        }
      }
    );
  });

  //Not working because of Auth problem
  /*
  test('Test adding new food to db', async () => {
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue(
      {
        getPayload: function() {
          return {
            name: 'Jaya',
            email: 'Jaya.the.great@gmail.com',
            picture: 'unavailable'
          };
        }
      }
    );
    jest.spyOn(User, 'findOne').mockResolvedValue(
      {
        name: 'Jaya',
        email: 'Jaya.the.great@gmail.com',
        profileImageURI: undefined   
      }
    );
    const newFood = {
          foodObj: {
            'name': `Samir's Fruits`,
            'calories': 464,
            'fat': 19.5,
            'protein': 7.19,
            'carbohydrate': 64.88,
            'sugars': 10.41,
            'fiber': 2.4,
            'cholesterol': 0,
            'calcium': 734,
            'iron': 6.64,
            'potassium': 117,
            'vitaminA': 0,
            'vitaminC': 0,
            'vitaminB12': 0.8,
            'vitaminD': 0,
            'sodium': 752,
            'isCustom': true
          }
      }
    const response = await session.post('/food-buds/api/v1/new-foods').send(newFood);
    expect(response.statusCode).toBe(200);
    expect(response.body.newData).toBe(newFood);
  });
  test('Test update custom food to db', async () => {
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue(
      {
        getPayload: function() {
          return {
            name: 'Jaya',
            email: 'Jaya.the.great@gmail.com',
            picture: 'unavailable'
          };
        }
      }
    );
    jest.spyOn(User, 'findOne').mockResolvedValue(
      {
        name: 'Jaya',
        email: 'Jaya.the.great@gmail.com',
        profileImageURI: undefined
      }
    );
    const newFood = {
          foodObj: {
            'name': `Samir's Fruits`,
            'calories': 464,
            'fat': 19.5,
            'protein': 7.19,
            'carbohydrate': 64.88,
            'sugars': 10.41,
            'fiber': 2.4,
            'cholesterol': 0,
            'calcium': 734,
            'iron': 6.64,
            'potassium': 117,
            'vitaminA': 0,
            'vitaminC': 0,
            'vitaminB12': 0.8,
            'vitaminD': 0,
            'sodium': 752,
            'isCustom': true
          }
      }
    const response = await session.put('/food-buds/api/v1/update-food').send(newFood);
    expect(response.statusCode).toBe(200);
    expect(response.body.NewData).toBe(newFood);
  });
  test('Test getting a specified food', async () => {
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue(
      {
        getPayload: function() {
          return {
            name: 'Jaya',
            email: 'Jaya.the.great@gmail.com',
            picture: 'unavailable'
          };
        }
      }
    );
    jest.spyOn(User, 'findOne').mockResolvedValue(
      {
        name: 'Jaya',
        email: 'Jaya.the.great@gmail.com',
        profileImageURI: undefined
      }
    );
    jest.spyOn(Food, 'findOne').mockResolvedValue(
      {
        name: 'Fruit',
        protein: 1
      }
    );
    jest.spyOn(Food, 'deleteOne').mockResolvedValue({ n: 1 });
    
    const response = await session.delete('/food-buds/api/v1/delete-food/Fruit');
    expect(response.statusCode).toBe(204);
    expect(response.body.message).toBe('Custom food deleted successfully');
  });
  */
});