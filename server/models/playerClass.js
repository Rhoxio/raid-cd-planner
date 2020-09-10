const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ClassSpecialization = require("./classSpecialization.js").classSpecialization

var PlayerClassSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  player_class_id: {
    type: Number,
    index: true
  },
  roles: Array,
  specs: [{ type: Schema.Types.ObjectId, ref: 'ClassSpecialization' }] 
});

var playerClass = mongoose.model('PlayerClass', PlayerClassSchema);

module.exports = {
  playerClass: playerClass
}