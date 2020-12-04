const nedb = require("nedb-async").AsyncNedb;
require("dotenv").config();

const DB_PATH = process.env.DB_PATH;

const db = new nedb({ filename: DB_PATH, timestampData: true, autoload: true });
db.loadDatabase();

module.exports = db;