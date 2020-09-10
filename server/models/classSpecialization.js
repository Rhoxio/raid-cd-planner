const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PlayerClass = require("./playerClass.js").playerClass

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
  }
});

var classSpecialization = mongoose.model('ClassSpecialization', ClassSpecializationSchema);

module.exports = {
  classSpecialization: classSpecialization
}