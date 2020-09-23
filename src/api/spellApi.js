import axios from 'axios';

export default class SpellAPI {
  
  static async all(){
    const promise = axios.get('http://localhost:3001/api/spells')
    const dataPromise = promise.then((response) => response.data)
    return dataPromise
  }
}