const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Create a new MongoClient
const client = new MongoClient(url);

client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
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