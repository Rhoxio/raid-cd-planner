const fs = require('fs');
const path = require('path')
const axios = require('axios');
const blizzard = require('../blizzard_api/blizzardBaseApi.js')
const PC = require("../models/playerClass.js").playerClass
const CS = require("../models/classSpecialization.js").classSpecialization

class ClassesSeeder { 

  seedAll(){
    this.seedClasses()
    this.seedClassDistinctions()
    this.seedClassSpecializations()
    this.associateClassesToSpecs()
  }

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

  seedClassDistinctions(next){
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
        if(next){next(models)}
      })

    })
  }

  seedClassSpecializations(next){ 
    const client = blizzard.api.client
    client.getApplicationToken().then(response => {
      let accessToken = response.data.access_token
      let specIndexUrl = `https://us.api.blizzard.com/data/wow/playable-specialization/index?namespace=static-us&locale=en_US&access_token=${accessToken}`
      axios.get(specIndexUrl).then(response => {
        let specIds = response.data.character_specializations.map((obj)=>{ return obj.id })
        specIds.forEach((id)=>{
          let specUrl = `https://us.api.blizzard.com/data/wow/playable-specialization/${id}?namespace=static-us&locale=en_US&access_token=${accessToken}`
          axios.get(specUrl).then(response => {
            CS.exists({name: response.data.name}, (err, result) =>{
              if(err){return console.log(err)}
              if (!result){
                let mediaUrl = `https://us.api.blizzard.com/data/wow/media/playable-specialization/${id}?namespace=static-us&locale=en_US&access_token=${accessToken}`
                axios.get(mediaUrl).then(res => {
                  let image = res.data.assets[0].value
                  let specialization = new CS({name: response.data.name, player_class_id: response.data.playable_class.id, player_class_name: response.data.playable_class.name, image: image})
                  specialization.save((err, cs)=>{
                    console.log(`Saved: ${cs.name}`)
                    if(err) return console.log(err)
                  })                  
                })
              } else {
                console.log(`Skipped seeding spec: ${response.data.name}`)
              }
            })
          })
        })
        if(next){next(cs)}
      })
    })
  }

  associateClassesToSpecs(next){
    PC.find({}, (err, klasses) =>{
      klasses.forEach((klass)=>{
        CS.find({player_class_id: klass.player_class_id}, (err, specs)=>{
          specs.forEach((c)=>{
            c.player_class = klass
            c.save((err)=>{
              if(err) return console.log(err)
            })
          })
          specs.forEach((c)=>{
            klass.specs.push(c)
          })
          klass.save(err=>{
            if(err) return console.log(err)
          })
        })
      })
      if(next) {next(klasses)}
    })
  }

}

const classSeed = new ClassesSeeder
module.exports = { classSeed }