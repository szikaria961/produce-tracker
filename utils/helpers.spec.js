const { generateReminders, isExpired } = require('./helpers');
const moment = require('moment');

const mockProduceData = [
  {
    "name": "Apple",
    "numDays": "0",
    "createdAt": "2020-01-01"
  },
  {
    "name": "Banana ",
    "numDays": "2",
    "createdAt": "2020-01-01"
  },
  {
    "name": "Orange",
    "numDays": "3",
    "createdAt": "2020-01-01"
  },
  {
    "name": "Kale",
    "numDays": "1",
    "createdAt": "2020-01-01"
  },
  {
    "name": "Lemon",
    "numDays": "0",
    "createdAt": "2020-01-01"
  }
];

describe('helpers', () => {
  describe('generateReminders', () => {
    test('should return list of produce which will expire under constraint', () => {
      const today = moment('20200103', 'YYYYMMDD');

      const expectedOutput = [
        {
          "createdAt": "2020-01-01",
          "daysLeftTillExpirationDay": 0,
          "expirationDate": "01/03/2020",
          "name": "Banana ",
          "numDays": "2",
          "text": "Banana  is expiring today.",
        },
        {
          "createdAt": "2020-01-01",
          "daysLeftTillExpirationDay": 1,
          "expirationDate": "01/04/2020",
          "name": "Orange",
          "numDays": "3",
          "text": "Orange is expiring tomorrow.",
        }
      ];

      expect(generateReminders({
        today,
        produceData: mockProduceData
      })).toEqual(expectedOutput);
    });

    test('should return an empty list', () => {
      const today = moment('20200105', 'YYYYMMDD');
      const expectedOutput = [];

      expect(generateReminders({
        today,
        produceData: mockProduceData
      })).toEqual(expectedOutput);
    });
  });
});

describe('check-produce', () => {
  describe('isExpired', () => {
    test('should return true for expired produce item', () => {
      const exampleNow = moment('20200103', 'YYYYMMDD');
      const exampleCreatedDate = moment('20200101', 'YYYYMMDD');

      const exampleProduceItem = {
        name: 'Strawberry',
        qty: 1,
        numDays: 1,
        createdAt: exampleCreatedDate
      }

      expect(isExpired({
        now: exampleNow,
        produceItem: exampleProduceItem
      })).toBe(true);
    });

    test('should return false for fresh produce item', () => {
      const exampleNow = moment('20200103', 'YYYYMMDD');
      const exampleCreatedDate = moment('20200101', 'YYYYMMDD');

      const exampleProduceItem = {
        name: 'Strawberry',
        qty: 1,
        numDays: 10,
        createdAt: exampleCreatedDate
      }

      expect(isExpired({
        now: exampleNow,
        produceItem: exampleProduceItem
      })).toBe(false);
    });

    test('should return false for no produce item', () => {
      expect(isExpired()).toBe(false)
    });
  });
});
