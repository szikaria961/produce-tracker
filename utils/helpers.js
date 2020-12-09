const db = require('../db');
const moment = require('moment');

function getExpirationDate(createdDate, numDays) {
  return moment(createdDate).add(numDays, 'days');
}

async function getProduceData() {
  return await db.asyncFind({});
}

function generateReminders({ today, produceData }) {
  const output = [];
  const MAX_DAYS_TILL_EXPIRATION = 2;

  produceData.forEach(({ name, numDays, createdAt }) => {
    const expirationDate = getExpirationDate(createdAt, numDays);
    const daysLeftTillExpirationDay = expirationDate.diff(today, 'days');

    const shouldGenerateReminder = (daysLeftTillExpirationDay <= MAX_DAYS_TILL_EXPIRATION)
      && (daysLeftTillExpirationDay >= 0);

    if (shouldGenerateReminder) {
      output.push({
        name,
        numDays,
        daysLeftTillExpirationDay,
        createdAt,
        expirationDate: expirationDate.format('L'),
        text: formatReminderText({ name, daysLeftTillExpirationDay })
      });
    }
  });

  return output;
}

function formatReminderText({ name, daysLeftTillExpirationDay }) {
  if (daysLeftTillExpirationDay === 0) {
    return `${name} is expiring today.`;
  } else if (daysLeftTillExpirationDay === 1) {
    return `${name} is expiring tomorrow.`;
  } else {
    return `${name} is expiring in ${daysLeftTillExpirationDay} days.`;
  }
}

function formatTwilioMessageBody(reminders) {
  let output = '';

  reminders.forEach(({ text }) => {
    output += `${text}\n`;
  });

  return output;
}

module.exports = {
    generateReminders,
    formatTwilioMessageBody
}
