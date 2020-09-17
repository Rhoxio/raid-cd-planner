spell = require("../models/classSpell.js").spell

const spellController = {
  byId(req, res){
    let id = req.params.id
    spell.find({_id: id}).exec((err, spell)=>{
      if(err) {
        console.log(err)
        return res.status(400).send()
      }
      res.json(spell)
    })
  },

  all(req, res){
    spell.find({}).exec((err, spells)=>{
      if(err) {
        console.log(err)
        return res.status(400).send()
      }
      res.json(spells)
    })
  }
}

module.exports = {
  controller: spellController
}