const express = require('express'),
    specRouter = express.Router(),
    specialization = require("../models/classSpecialization.js").classSpecialization

// Retrieve single

// Need to pull this logic out into controller logic specifically.
// Single responsibility per set of behavioral delegation... pulling shit out into other files at the very least.

specRouter.get('/spec/:id', (req, res)=>{
  let id = req.params.id
  specialization.find({_id: id}).exec((err, spec)=>{
    if(err) {
      console.log(err)
      return res.status(400).send()
    }
    res.json(spec)
  })
})

// All Specs
specRouter.get('/specs', (req, res)=>{
  specialization.find({}).exec((err, specs)=>{
    if(err) {
      console.log(err)
      return res.status(400).send()
    }
    res.json(specs)
  })
})

module.exports = { specs: specRouter }



