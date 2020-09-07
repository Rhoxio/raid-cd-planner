const mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.connect('mongodb://localhost/raid-cd-planner-dev', {useNewUrlParser: true});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to Mongo!")
});

const axios = require('axios');
const blizzard = require('../blizzard_api/blizzardBaseApi.js')
const PC = require("../models/playerClass.js").playerClass

class SeedClasses { 
  retrieveClasses(next){
    let client = blizzard.api.client
    client.getApplicationToken().then(response => {
      let accessToken = response.data.access_token
      let url = `https://us.api.blizzard.com/data/wow/playable-class/index?namespace=static-us&locale=en_US&access_token=${accessToken}`
      axios.get(url).then(response => {
        next(response.data.classes)
      })
    });
  }

  seedClasses(next){
    this.retrieveClasses(classes => {
      classes.forEach(set => {
        PC.exists({name: set.name, player_class_id: set.id}, (err, result) =>{
          if (err){
            if (err) return console.log(err)
          } else if(!result) {
            let playerClass = new PC({ name: set.name, player_class_id: set.id });
            playerClass.save((err, pc)=>{
              if (err) return console.log(err)
              if(next){next(pc)}                
            })
          } else {
            console.log(`Skipped seeding: ${set.name}`)
          }
          
        })
      })
    })
  }

}

const classSeed = new SeedClasses
module.exports = { classSeed }