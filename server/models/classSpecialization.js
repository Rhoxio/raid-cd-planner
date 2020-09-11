const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PlayerClass = require("./playerClass.js").playerClass
const ClassSpell = require("./classSpell.js").spell

var ClassSpecializationSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  player_class_id: {
    type: Number,
    index: true
  },
  player_class_name: {
    type: String
  },
  image: {
    type: String
  },
  player_class: { 
    type: Schema.Types.ObjectId, 
    ref: 'PlayerClass' 
  },
  spells: [{ type: Schema.Types.ObjectId, ref: 'Spell' }]
});

var classSpecialization = mongoose.model('ClassSpecialization', ClassSpecializationSchema);

module.exports = {
  classSpecialization: classSpecialization
}