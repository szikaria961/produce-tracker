const db = require('../db');
const moment = require('moment');
const { getExpirationDate } = require('../utils/helpers');

function isExpired({
  now = new Date(),
  produceItem
} = {}) {
  if (produceItem) {
    const { createdAt, numDays } = produceItem;

    return moment(now).isAfter(getExpirationDate(createdAt, numDays));
  }

  return false;
}

module.exports = {
  isExpired,
}
