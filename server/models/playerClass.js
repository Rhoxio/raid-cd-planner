var mongoose = require("mongoose");

var PlayerClassSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  player_class_id: {
    type: Number,
    index: true
  },
  roles: Array
});

var playerClass = mongoose.model('PlayerClass', PlayerClassSchema);

module.exports = {
  playerClass: playerClass
}