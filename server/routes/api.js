const express = require('express'),
    specRouter = express.Router(),
    playerClassRouter = express.Router(),
    spellRouter = express.Router(),
    specialization = require("../models/classSpecialization.js").classSpecialization,
    specController = require("../controllers/specializationController").controller,
    playerClassController = require("../controllers/playerClassController").controller,
    spellController = require("../controllers/spellController").controller

specRouter.get('/spec/:id', (req, res)=>{
  specController.byId(req, res)
})

// All Specs
specRouter.get('/specs', (req, res)=>{
  specController.all(req, res)
})

playerClassRouter.get('/playerclass/:id', (req, res)=>{
  playerClassController.byId(req, res)
})

playerClassRouter.get('/playerclasses', (req, res)=>{
  playerClassController.all(req, res)
})

spellRouter.get('/spell/:id', (req, res)=>{
  spellController.byId(req, res)
})

spellRouter.get('/spells', (req, res)=>{
  spellController.all(req, res)
})

module.exports = { 
  specs: specRouter, 
  playerClass: playerClassRouter,
  spells: spellRouter
}



