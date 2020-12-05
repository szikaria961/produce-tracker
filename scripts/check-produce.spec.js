const { isExpired } = require('./check-produce');
const moment = require('moment');

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
      const exampleCreatedDate = moment('20201203', 'YYYYMMDD');

      const exampleProduceItem = {
        name: 'Strawberry',
        qty: 1,
        numDays: 10,
        createdAt: exampleCreatedDate
      }

      expect(isExpired({
        produceItem: exampleProduceItem
      })).toBe(false);
    });

    test('should return false for no produce item', () => {
      expect(isExpired()).toBe(false)
    });
  });
})

