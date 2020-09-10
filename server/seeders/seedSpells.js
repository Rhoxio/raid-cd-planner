const fs = require('fs');
const path = require('path')
const $ = require('cheerio');
const axios = require('axios');
const puppeteer = require('puppeteer')

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

  async scrapeWowhead(){
    // aoe, external, personal
    // defensive, healing, immunity, mobility, cheat_death, buff
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const refData = await this.getReferenceData()
    let aoe = refData.aoe
    let external = refData.external
    let personal = refData.personal
    await this.asyncForEach(external.defensive, async (spell)=>{
      let spellName = spell.split(" ").join("+")
      console.log(spellName)
      let url = `https://www.wowhead.com/spells/name:${spellName}`
      // console.log(url)
      await page.goto(url)
      const html = await page.content();
      // console.log(html)
      console.log($('.q-1', html)['0'].attribs.href)


      // axios.get(url).then((html)=>{
      //   console.log(html.data)
      //   // console.log($('.listview-row', html.data))
      // })
    })    
    browser.close()
    

      // url = 


      // console.log(external.defensive)


  }
}

const seeder = new SeedSpells
module.exports = { seeder } 