import axios from 'axios';

export default class PlayerClassAPI {
  
  static async all(){
    const promise = axios.get('http://localhost:3001/api/playerclasses')
    const dataPromise = promise.then((response) => response.data)
    return dataPromise
  }

  static async find(id){
    const promise = axios.get(`http://localhost:3001/api/playerclass/${id}`)
    const dataPromise = promise.then((response) => response.data)
    return dataPromise
  }
}