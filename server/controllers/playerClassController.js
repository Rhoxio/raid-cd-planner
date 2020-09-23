playerClass = require("../models/playerClass.js").playerClass

const playerClassController = {
  byId(req, res){
    let id = req.params.id
    playerClass.find({_id: id}).exec((err, klass)=>{
      if(err) {
        console.log(err)
        return res.status(400).send()
      }
      res.json(klass)
    })
  },

  all(req, res){
    playerClass.find({}).exec((err, pcs)=>{
      if(err) {
        console.log(err)
        return res.status(400).send()
      }
      pcs.map((pc)=>{pc.name = pc.name.split(" ").join("-"); pc;})
      res.json(pcs)
    })
  }
}

module.exports = {
  controller: playerClassController
}