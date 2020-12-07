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

    if(getDiff == 2) {
      body += `${name} is expiring in ${getDiff} days.\n`;
    } else if(getDiff == 0) {
      body += `${name} is expiring Today.\n`
    } else if(getDiff == 1) {
      body += `${name} is expiring in a day.\n`
    }
  });
  return body;
}

module.exports = {
  createTwilioMessage
}