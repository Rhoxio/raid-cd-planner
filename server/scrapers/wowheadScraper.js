const fs = require('fs');
const path = require('path')
const $ = require('cheerio');
const axios = require('axios');
const puppeteer = require('puppeteer')
const blizzard = require('../blizzard_api/blizzardBaseApi.js')
const ClassSpell = require("../models/classSpell.js").spell
const specialization = require("../models/classSpecialization.js").classSpecialization

class WowheadScraper {
  async getReferenceData(){
    let spellLookup = JSON.parse(fs.readFileSync(path.join(__dirname, '../lookups/class_cooldowns.json')));    
    return await spellLookup
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
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
}

const scraper = new WowheadScraper
module.exports = { scraper }