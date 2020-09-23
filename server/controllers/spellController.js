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
    console.log(req.query)
    let query = {}
    if(req.query.player_class){
      // Given query must be URL encoded.
      query.player_class_name = req.query.player_class.split(" ").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")
    }
    spell.find(query).exec((err, spells)=>{
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