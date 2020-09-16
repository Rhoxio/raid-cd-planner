const dotenv = require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const assert = require('assert');

const mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.connect('mongodb://localhost/raid-cd-planner-dev-5', {useNewUrlParser: true});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { console.log("Connected to Mongo!") });

const axios = require('axios');
const blizzard = require('./blizzard_api/blizzardBaseApi.js')

const PC = require("./models/playerClass.js").playerClass
const CS = require("./models/classSpecialization.js").classSpecialization
const spellSeeder = require('./seeders/seedSpells.js').seeder
const ClassSpell = require("./models/classSpell.js").spell


const specRoutes = require("./routes/api").specs


// spellSeeder.seedSpells()
// spellSeeder.associateSpellsToSpecs()
// CS.find({}).populate("spells").exec((err, specs)=>{
//   specs.forEach((spec)=>{
//     console.log(spec.name)
//     spec.spells.forEach((spell)=>{
//       console.log(spell)
//     })
//     console.log("--------")
//   })
// })

// ClassSpell.find({}).exec((err, spells)=>{
//   spells.forEach(spell=>{
//     console.log(spell)
//     spell.specs = []
//     spell.save((err, spell)=>{
//       if(err) console.log(err)
//       console.log(spell)
//     })
//   })
// })

// CS.find({}, (err, specs)=>{
//   // console.log(specs)
//   specs.forEach(spec=>{
//     spec.spells = []
//     spec.save((err, spec)=>{
//       console.log(spec)
//     })
//   })
// })

// Next up is API routes for the front end to consume. 

// const blizzard = require('./blizzard_api/blizzardBaseApi.js')
// const characterSeeder = require('./seeders/seedClasses.js')
// console.log(characterSeeder.classSeed.seedClasses())
// console.log(characterSeeder.classSeed.seedClassDistinctions())
// console.log(characterSeeder.classSeed.seedClassSpecializations())
// console.log(characterSeeder.classSeed.seedAll())

// CS.find().exec((err, models)=>{
//   console.log(models)
// })

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use('/api', specRoutes)

app.get('/home', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send("<h1>Hi!</h1>");
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);