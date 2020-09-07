const dotenv = require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const assert = require('assert');

const mongoUrl = 'mongodb://localhost:27017';
const Mongo = require('mongodb').MongoClient;
const mongoClient = new Mongo(mongoUrl);
const dbName = 'raid-cd-planner-dev';

const blizzard = require('./blizzard_api/blizzardBaseApi.js')

mongoClient.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = mongoClient.db(dbName);

  mongoClient.close();
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/home', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  // res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
  res.send("<h1>Hi!</h1>");
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);