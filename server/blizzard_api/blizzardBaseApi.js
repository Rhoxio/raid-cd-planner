const axios = require('axios');

class BlizzardBase {
  constructor() {
    this.client = require('blizzard.js').initialize({
      key: process.env.BLIZZ_CLIENT_ID,
      secret: process.env.BLIZZ_SECRET,
      origin: 'us', // optional
      locale: 'en_US' // optional
      // token: '' // optional
    });
    this.test = () => {console.log("OK!")}
  }

  refreshToken(){
    this.client.getApplicationToken().then(response => {
      client.defaults.token = response.data.access_token
    });
  }

  async retrieveSpellIconUrl(spellId, next){

    return await this.client.getApplicationToken().then(res =>{
      let accessToken = res.data.access_token
      let url = `https://us.api.blizzard.com/data/wow/media/spell/${spellId}?namespace=static-us&locale=en_US&access_token=${accessToken}`
      return axios.get(url).then(response =>{
        // console.log(response.data.assets[0].value)
        return response.data.assets[0].value
      }).catch((err, res) =>{
        if(err) console.log(`Invalid Blizzard API Call: ${err.config.url} not found`)
      })
    })
  }  
}

const api = new BlizzardBase
module.exports = { api } 