const dotenv = require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const assert = require('assert');

// const blizzard = require('./blizzard_api/blizzardBaseApi.js')
const characterSeeder = require('./seeders/seedClasses.js') 
console.log(characterSeeder.classSeed.seedClassDistinctions())

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/home', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send("<h1>Hi!</h1>");
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);