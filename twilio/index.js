const MessagingResponse = require('twilio').twiml.MessagingResponse;
require("dotenv").config();
const { createTwilioMessage } = require('../utils/helpers');
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const FROM = process.env.FROM;
const TO = process.env.TO;

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function sendReminder() {
  let message = await createTwilioMessage();
  if(message != null){
    client.messages.create({
      from: FROM,
      body: message,
      to: TO
    })
    .then(messages => console.log(`Message sent! ${messages.sid}`))
    .catch(e => { console.error('Error', e.code, e.message)});
  }
}
module.exports = {
  sendReminder
}
