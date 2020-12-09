const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, '../../.env') });
const { generateReminders, formatTwilioMessageBody } = require('../../utils/helpers');

const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const FROM = process.env.FROM;
const TO = process.env.TO;

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function sendText(body) {
  client.messages.create({
    from: FROM,
    body,
    to: TO
  })
  .then(messages => console.log(`Message sent! ${messages.sid}`))
  .catch(e => { console.error('Error', e.code, e.message)});
}

module.exports = {
  sendText
}
