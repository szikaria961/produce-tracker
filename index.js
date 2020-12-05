const express = require("express");
const Joi = require("joi");
require("dotenv").config();
const db = require('./db');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const { createTwilioMessage } = require('./utils/helpers');

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

const querySchema = Joi.object({
  _id: Joi.string().required(),
});

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
  try {
    const data = await db.asyncFind({});
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.get("/api/produce/:id", async (req, res, next) => {
  const input = {
    _id: req.params.id,
  };

  try {
    await querySchema.validateAsync(input);
    const data = await db.asyncFindOne(input);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/produce/:id', async (req, res, next) => {
  const query = { _id: req.params.id };

  try {
    await querySchema.validateAsync(query);
    const data = await db.asyncFindOne(query);
    const count = await db.asyncRemove(query, {});
    res.json({ removed: data });
  } catch (err) {
    next(err);
  }
});

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
sendReminder();
