specialization = require("../models/classSpecialization.js").classSpecialization

const specializationController = {
  byId(req, res){
    let id = req.params.id
    specialization.find({_id: id}).exec((err, spec)=>{
      if(err) {
        console.log(err)
        return res.status(400).send()
      }
      res.json(spec)
    })
  },

  all(req, res){
    specialization.find({}).exec((err, specs)=>{
      if(err) {
        console.log(err)
        return res.status(400).send()
      }
      res.json(specs)
    })
  }
}

module.exports = {
  controller: specializationController
}