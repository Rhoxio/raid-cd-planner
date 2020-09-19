const express = require('express');
const indexRouter = express.Router()
const indexController = require("../controllers/indexController").controller

indexRouter.get('/', (req, res)=>{
  indexController.show(req, res)
})

module.exports ={
  router: indexRouter
}