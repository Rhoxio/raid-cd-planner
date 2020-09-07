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

  client(){
    return this.client;
  }

  retrieveToken(){
    this.client.getApplicationToken().then(response => {
      client.defaults.token = response.data.access_token 
    });
  }
}

const api = new BlizzardBase


module.exports = { api } 