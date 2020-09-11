const fs = require('fs');
const path = require('path')
const $ = require('cheerio');
const axios = require('axios');
const puppeteer = require('puppeteer')
const blizzard = require('../blizzard_api/blizzardBaseApi.js')
const ClassSpell = require("../models/classSpell.js").spell

class SeedSpells{
  async getReferenceData(){
    let spellLookup = JSON.parse(fs.readFileSync(path.join(__dirname, '../lookups/class_cooldowns.json')));    
    return await spellLookup
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }  

  async retrieveSpellIconUrl(spellId, next){
    let client = blizzard.api.client
    await client.getApplicationToken().then(res =>{
      let accessToken = res.data.access_token
      let url = `https://us.api.blizzard.com/data/wow/media/spell/${spellId}?namespace=static-us&locale=en_US&access_token=${accessToken}`
      axios.get(url).then(response =>{
        // console.log(response.data.assets[0].value)
        next(response.data.assets[0].value)
      })
    })
  }

  convertToSeconds(input){
    if(input === undefined) return undefined
    let chunks = input.split(" ")
    let totalDuration = 0
    if(chunks[1] == "minutes" || chunks[1] == "minute"){
      totalDuration = (chunks[0]*60)
    } else {
      totalDuration = parseInt(chunks[0])
    }
    return totalDuration
  }

  async scrapeWowhead(){
    // aoe, external, personal
    // defensive, healing, immunity, mobility, cheat_death, buff
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const refData = await this.getReferenceData()

    let aoe = refData.aoe
    let external = refData.external
    let personal = refData.personal

    const parentTypes = [aoe, external, personal]
    const childTypes = ["defensive", "healing", "immunity", "mobility", "cheat_death", "buff"]

    await this.asyncForEach(parentTypes, async (parentType)=>{
      let parentKey = parentType.parent_key
      await this.asyncForEach(childTypes, async (childType)=>{
        var set = parentType[childType]
        await this.asyncForEach(set, async (spellName)=>{
          let spellData = new ClassSpell({primary_type: parentKey, subtype: childType})

          spellData.name = spellName

          let spellNameQuery = spellName.split(" ").join("+")

          // console.log("------------")
          // console.log(spellNameQuery)

          let url = `https://www.wowhead.com/spells/name:${spellNameQuery}` 
          await page.goto(url)

          let html = await page.content();
          let detailUrl = `https://www.wowhead.com${$('.q-1', html)['0'].attribs.href}`
          
          await page.goto(detailUrl)
          html = await page.content()

          if(!!$('.tinyicontxt', html)['0']){
            spellData.player_class_name = $('.tinyicontxt', html)['0'].children[0].data
          }
          
          let durationStr = $('.grid .first td', html)['0'].children[0].data
          let cdString = $('.auto-width tbody', html)['0'].children[8].children[3].children[0].data

          spellData.wowhead_link = detailUrl
          spellData.duration = this.convertToSeconds(durationStr)
          spellData.cooldown = this.convertToSeconds(cdString)

          let blizzId = detailUrl.split("/")[3].split("=")[1]
          spellData.blizzard_id = parseInt(blizzId)
          await this.retrieveSpellIconUrl(blizzId, (data)=>{
            spellData.image = data
            // console.log(spellData)
            ClassSpell.exists({name: spellName}, (err, model)=>{
              console.log("--------")
              // console.log(spellName)            
              if(model){
                console.log(`Skipped spell: ${spellName}`)
              } else {
                spellData.save((err, model)=>{
                  if(err) return console.log(err)
                  console.log(`Saved spell: ${spellName}`)
                  console.log(model)
                })
              }

            })            
          })


          
        })          
      })
    })

  
    browser.close()
    console.log("Spells finished seeding!")
    
  }
}

const seeder = new SeedSpells
module.exports = { seeder } 