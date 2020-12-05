const db = require('../db');
const moment = require('moment');

function getExpirationDate(createdDate, numDays) {
  return moment(createdDate).add(numDays, 'days');
}

async function createTwilioMessage() {
  const data = await db.asyncFind({});
  const today = moment();
  let body = '';
  data.forEach(({ name, qty, numDays, createdAt }) => {
    let expirationDate = getExpirationDate(createdAt, numDays);
    let getDiff = expirationDate.diff(today, 'days');

    if(getDiff < 3 && getDiff >= 1) {
      body += `${name} is expiring in ${getDiff} day(s).\n`;
    } else if( getDiff == 0) {
      body += `${name} is expiring Today.\n`
    }
  });
  return body;
}

module.exports = {
  createTwilioMessage
}