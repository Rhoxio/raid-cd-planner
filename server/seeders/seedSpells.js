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
      console.log("------------")
      console.log(spellName)
      let url = `https://www.wowhead.com/spells/name:${spellName}`
      // console.log(url)
      await page.goto(url)
      let html = await page.content();
      // console.log(html)
      let detailUrl = `https://www.wowhead.com${$('.q-1', html)['0'].attribs.href}`
      // Need the ID from this URl to set img later.
      console.log(detailUrl)
      await page.goto(detailUrl)
      html = await page.content();
      let className = $('.tinyicontxt', html)['0'].children[0].data
      let durationStr = $('.grid .first td', html)['0'].children[0].data
      let cdString = $('.auto-width tbody', html)['0'].children[8].children[3].children[0].data
      // If undefined, when put into hash check against and return keys for manual auditing.
      
      console.log(cdString)



      


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