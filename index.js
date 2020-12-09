const express = require("express");
const Joi = require("joi");
require("dotenv").config();
const db = require('./db');
const morgan = require("morgan");

const PORT = process.env.PORT || 8000;
const DB_PATH = process.env.DB_PATH || "produce.db";
const API_KEY = process.env.API_KEY;

const BASE_URL ="https://trackapi.nutritionix.com/v2/search/instant/query";

const app = express();

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`[ index.js ] Listening on ${PORT}`);
});

const postSchema = Joi.object({
  name: Joi.string()
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
    const { name, numDays } = req.body;
    const item = { name, numDays };

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
