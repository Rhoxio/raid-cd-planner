const fs = require('fs');
const path = require('path')
const $ = require('cheerio');
const axios = require('axios');
const puppeteer = require('puppeteer')
const blizzard = require('../blizzard_api/blizzardBaseApi.js')
const ClassSpell = require("../models/classSpell.js").spell
const specialization = require("../models/classSpecialization.js").classSpecialization

class WowheadScraper {

  constructor(){
    this.browser = undefined
    this.page = undefined
  }

  async boot(){
    const browser = await puppeteer.launch()
    this.browser = browser
    this.page = await browser.newPage()
    console.log("Puppeteer booted...")
    return true
  }

  async stop(){
    this.browser.close()
    console.log("Pupeteer closed.")
  }

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

  extractPlayerClassName(html){
    if(!!$('.tinyicontxt', html)['0']){
      let name = $('.tinyicontxt', html)['0'].children[0].data
      return name
    }
    return undefined
  }

  extractDuration(html){
    let duration =  $('.grid .first td', html)['0'].children[0].data
    return this.convertToSeconds(duration)
  }

  extractCooldown(html){
    let cooldown = $('.auto-width tbody', html)['0'].children[8].children[3].children[0].data
    return this.convertToSeconds(cooldown)
  }

  extractSpecName(html){
    if($('.wowhead-tooltip-requirements', html)['0']){   
     let data = $('.wowhead-tooltip-requirements', html) 
     let specNames = []
     let i = 0 
     for (i = 0; i < data.length; i++){  
       let nodeData = data[i.toString()] 
       if(nodeData.children.length){ 
         nodeData.children.forEach((entry)=>{  
           if(entry.data.includes(")")){ 
             // Requires Warrior (Protection)  
             let start = nodeData.children[0].data.indexOf("(")  
             let end = nodeData.children[0].data.indexOf(")")  
             let names = nodeData.children[0].data.slice(start+1, end).split(",").map( s => s.trim())
             specNames = names  
           } 
         })  
       } 
     }
     return specNames 
    }     
  }

  spellDetailUrl(html){
    let chunk = $('.q-1', html)['0'].attribs.href
    if(chunk != undefined){
      return `https://www.wowhead.com${chunk}`  
    }
  }

  async spellSearchPage(name){
    const browser = this.browser
    const page = this.page

    let spellNameQuery = name.split(" ").join("+")

    let url = `https://www.wowhead.com/spells/name:${spellNameQuery}` 
    await page.goto(url)
    let html = await page.content();
    return html
  }

  async spellDetailPage(name){
    const browser = this.browser
    const page = this.page

    let searchHtml = await this.spellSearchPage(name)
    let detailUrl = this.spellDetailUrl(searchHtml)
    
    await page.goto(detailUrl)
    let html = await page.content()
    return html
  }
}

const scraper = new WowheadScraper
module.exports = { scraper }