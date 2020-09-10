const fs = require('fs');
const path = require('path')
const $ = require('cheerio');
const axios = require('axios');

class SeedSpells{
  async referenceData(){
    let spellLookup = JSON.parse(fs.readFileSync(path.join(__dirname, '../lookups/class_cooldowns.json')));    
    return spellLookup
  }

  scrapeWowhead(){
    this.referenceData().then(refData =>{
      // aoe, external, personal
      // defensive, healing, immunity, mobility, cheat_death, buff
      
    })
  }
}

const seeder = new SeedSpells
module.exports = { seeder } 