const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ClassSpecialization = require("./classSpecialization.js").classSpecialization

var SpellSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  player_class_name: {
    type: String
  },
  duration: {
    type: Number
  },
  cooldown: {
    type: Number
  },
  spec: { 
    type: Schema.Types.ObjectId, 
    ref: 'ClassSpecialization' 
  }
})

var spell = mongoose.model('Spell', SpellSchema);

module.exports = { spell }