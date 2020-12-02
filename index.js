const express = require("express");
const Datastore = require("nedb");
require("dotenv").config();
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const PORT = process.env.PORT || 8000;
const API_KEY = process.env.API_KEY;
const APP_ID = process.env.APP_ID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const FROM = process.env.FROM;
const TO = process.env.TO;

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const BASE_URL ="https://trackapi.nutritionix.com/v2/search/instant/query";

const db = new Datastore('produce.db');
db.loadDatabase();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`[ index.js ] Listening on ${PORT}`);
});

app.get('/home', function (req, res) {
  res.send('Hello World!')
});

app.post('/api/produce', (req, res) => {
  const { name } = req.body;
  const item = {
    name
  };

  db.insert(item, (error, result) => {
    if(error) {
      res.status(500).send('Internal server error');
    } else {
      res.json(result);
    }
  });
});

// client.messages.create({
//   from: FROM,
//   body: 'This is a text from Produce Tracker',
//   to: TO
// })
// .then(messages => console.log(`Message sent! ${messages.sid}`))
// .catch(e => { console.error('Error', e.code, e.message)});
