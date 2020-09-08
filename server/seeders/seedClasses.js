const mongoose = require('mongoose');
const db = mongoose.connection;
const fs = require('fs');
const path = require('path')

mongoose.connect('mongodb://localhost/raid-cd-planner-dev', {useNewUrlParser: true});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to Mongo!")
});

const axios = require('axios');
const blizzard = require('../blizzard_api/blizzardBaseApi.js')
const PC = require("../models/playerClass.js").playerClass

class ClassesSeeder { 
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

  seedClassDistinctions(){
    let client = blizzard.api.client
    let specLookup = JSON.parse(fs.readFileSync(path.join(__dirname, '../lookups/spec_mappings.json')));
    client.getApplicationToken().then(response => {
      let accessToken = response.data.access_token
      PC.find({}, (err, models) =>{
        models.forEach( klass =>{
          if (klass.roles.length == 0){
            const url = `https://us.api.blizzard.com/data/wow/playable-class/${klass.player_class_id}?namespace=static-us&locale=en_US&access_token=${accessToken}`  
            axios.get(url).then(response => {
              const specNames = response.data.specializations.map(desc => { return desc.name.toLowerCase() })
              const tank = specNames.some( r => specLookup["tanks"].includes(r) )
              const healer = specNames.some( r => specLookup["healers"].includes(r) )
              const dps = specNames.some( r => specLookup["dps"].includes(r) )

              if (tank) klass.roles.push("tank")
              if (healer) klass.roles.push("healer")
              if (dps) klass.roles.push("dps")
              klass.save((err)=>{
                if (err) return console.log(err) 
                console.log(`Added role info to: ${klass.name}`)
              })
            })            
          } else {
            console.log(`Skipped adding roles to: ${klass.name}`)
          }
        })
      })

    })


  }

}

const classSeed = new ClassesSeeder
module.exports = { classSeed }