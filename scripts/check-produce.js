const { sendText } = require('../services/twilio');
const moment = require('moment');
const {
  getProduceData,
  generateReminders,
  formatTwilioMessageBody
} = require('../utils/helpers');

async function main() {
  const produceData = await getProduceData();
  const today = moment();
  const reminders = generateReminders({ today, produceData });
  const hasReminders = reminders.length > 0;

  if (hasReminders) {
    const body = formatTwilioMessageBody(reminders);
    await sendText(body);
  }
}

main();
