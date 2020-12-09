const { sendText } = require('../services/twilio');
const { generateReminders, formatTwilioMessageBody } = require('../utils/helpers');

async function main() {
  const reminders = await generateReminders();
  const hasReminders = reminders.length > 0;

  if (hasReminders) {
    const body = formatTwilioMessageBody(reminders);
    await sendText(body);
  }
}

main();
