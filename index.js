const express = require("express");
const Datastore = require("nedb");
const nedb = require("nedb-async").AsyncNedb;
const Joi = require("joi");
require("dotenv").config();
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const PORT = process.env.PORT || 8000;
const DB_PATH = process.env.DB_PATH || "produce.db";
const API_KEY = process.env.API_KEY;
const APP_ID = process.env.APP_ID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const FROM = process.env.FROM;
const TO = process.env.TO;

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const BASE_URL ="https://trackapi.nutritionix.com/v2/search/instant/query";

const db = new nedb({ filename: DB_PATH, timestampData: true, autoload: true });
db.loadDatabase();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`[ index.js ] Listening on ${PORT}`);
});

const postSchema = Joi.object({
  name: Joi.string()
  .required(),
  qty: Joi.number()
  .integer()
  .required(),
  numDays: Joi.number()
  .integer()
  .required()
})

app.get('/home', function (req, res) {
  res.send('Hello World!')
});

app.post('/api/produce', async (req, res, next) => {
  try {
    const { name, qty, numDays } = req.body;
    const item = { name, qty, numDays };

    await postSchema.validateAsync(item);
    const data = await db.asyncInsert(item);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.get('/api/produce', async (req, res, next) => {
  try{
    const data = await db.asyncFind({});
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// client.messages.create({
//   from: FROM,
//   body: 'This is a text from Produce',
//   to: TO
// })
// .then(messages => console.log(`Message sent! ${messages.sid}`))
// .catch(e => { console.error('Error', e.code, e.message)});
