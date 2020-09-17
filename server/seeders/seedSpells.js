const fs = require('fs');
const path = require('path')
const $ = require('cheerio');
const axios = require('axios');
const puppeteer = require('puppeteer')
const blizzard = require('../blizzard_api/blizzardBaseApi.js').api
const ClassSpell = require("../models/classSpell.js").spell
const specialization = require("../models/classSpecialization.js").classSpecialization
const scraper = require("../scrapers/wowheadScraper.js").scraper

class SeedSpells{

  // Scraper
  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }  

  // ClassSpell function
  // Temporary until I write the validators in.
  removeDuplicates(){
    ClassSpell.find({}).populate("specs").exec((err, spells)=>{
      let i = 0
      for (i = 0; i < spells.length; i++){
        let specs = spells[i].specs  
        let uniqueChars = specs.filter((c, index) => {
            return specs.indexOf(c) === index;
        });
        spells[i].specs = uniqueChars
        spells[i].save((err, s)=>{
          if (err) return console.log(err)
        })
      }
    })
  }

  // This
  associateSpellsToSpecs(){
    ClassSpell.find({}, (err, spells)=>{
      // console.log(spells)
      spells.forEach((spell)=>{
        specialization.find({player_class_name: spell.player_class_name, name: spell.spec_names}, (err, foundSpecs)=>{

          if(foundSpecs.length === 0){
            // If theres a spell that doesnt have any results, associate to it anyway. 
            specialization.find({player_class_name: spell.player_class_name}, (err, specs)=>{
              spell.specs = specs
              spell.save((err, savedSpell)=>{
                if(err) return console.log(err)
                console.log(`Associated spec to: ${savedSpell.name}`)
                specs.forEach((spec)=>{
                  spec.spells.push(spell)
                  spec.save((err, s)=>{
                    if(err) return console.log(err)
                    console.log(`Associated Spell to spec: ${s.name}`)  
                  })
                  
                })
              })              
            })

          } else {
            spell.specs = foundSpecs  
            spell.save((err, savedSpell)=>{
              if(err) return console.log(err)
              console.log(`Associated spec to: ${savedSpell.name}`)
              foundSpecs.forEach((spec)=>{
                spec.spells.push(spell)
                spec.save((err, s)=>{
                  if(err) return console.log(err)
                  console.log(`Associated Spell to spec: ${s.name}`)  
                })
                
              })
            })
          }
        })
      })
    })
  }

  // Scraper
  async seedSpells(){
    // aoe, external, personal
    // defensive, healing, immunity, mobility, cheat_death, buff

    // const browser = await puppeteer.launch()
    // const page = await browser.newPage()
    await scraper.boot()

    const refData = await scraper.getReferenceData()

    const aoe = refData.aoe
    const external = refData.external
    const personal = refData.personal
    const parentTypes = [aoe, external, personal]
    const childTypes = ["defensive", "healing", "immunity", "mobility", "cheat_death", "buff"]

    await this.asyncForEach(parentTypes, async (parentType)=>{
      let parentKey = parentType.parent_key
      await this.asyncForEach(childTypes, async (childType)=>{
        var set = parentType[childType]
        await this.asyncForEach(set, async (spellName)=>{
          // console.log(spellName)
          let spellData = new ClassSpell({primary_type: parentKey, subtype: childType})
          spellData.name = spellName

          let spellNameQuery = spellName.split(" ").join("+")
          let detailPageHtml = await scraper.spellDetailPage(spellNameQuery)
          let detailUrl = scraper.spellDetailUrl(await scraper.spellSearchPage(spellName))

          let blizzId = parseInt(detailUrl.split("/")[3].split("=")[1])

          spellData.wowhead_link = detailUrl
          spellData.duration = scraper.extractDuration(detailPageHtml)
          spellData.cooldown = scraper.extractCooldown(detailPageHtml)
          spellData.blizzard_id = blizzId
          spellData.image = await blizzard.retrieveSpellIconUrl(blizzId)
          spellData.spec_names = scraper.extractSpecName(detailPageHtml)
          spellData.player_class_name = scraper.extractPlayerClassName(detailPageHtml)

          ClassSpell.exists({name: spellName, blizzard_id: blizzId}, (err, model)=>{          
            if(model){
              console.log(`Skipped spell: ${spellName}`)
            } else {
              spellData.save((err, model)=>{
                if(err) return console.log(err)
                console.log(`Saved spell: ${spellName}`)
                console.log(model)
              })
            }
            console.log("--------")
          })          
          
        })          
      })
    })

    await scraper.stop()

    // browser.close()
    // console.log("Spells finished seeding!")
    
  }
}

const seeder = new SeedSpells
module.exports = { seeder } 