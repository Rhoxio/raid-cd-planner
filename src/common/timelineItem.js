// { 
//     "_id" : ObjectId("5f5df36de5c2aa7530f332b9"), 
//     "specs" : [
//         ObjectId("5f5c42690169122f7066de5b")
//     ], 
//     "spec_names" : [
//         "Holy"
//     ], 
//     "primary_type" : "aoe", 
//     "subtype" : "defensive", 
//     "name" : "Aura Mastery", 
//     "wowhead_link" : "https://www.wowhead.com/spell=31821/aura-mastery", 
//     "duration" : NumberInt(8), 
//     "cooldown" : NumberInt(180), 
//     "blizzard_id" : NumberInt(31821), 
//     "image" : "https://render-us.worldofwarcraft.com/icons/56/spell_holy_auramastery.jpg", 
//     "player_class_name" : "Paladin", 
//     "__v" : NumberInt(9)
// }
import Moment from 'moment';

// Assuming this is coming straight from Mongo...
export default class TimelineItem {
  constructor(startTime, opts){
    this.name = opts.name
    this.playerClass = opts.player_class_name
    this.primaryType = opts.primary_type
    this.subtype = opts.subtype

    this.duration = this.secondsToTime(startTime, opts.duration)
    this.cooldown = this.secondsToTime(startTime, opts.cooldown)
    
    this.start = startTime
    this.end = this.duration
  }

  
  // Need an API for taking data from Mongo.

  // (Batch load on start, or ajax all of the data in on a per-case basis?)
  // Prob just go with the reload. It's nota lot of data per request, and would need to be delegated to
  // proper classes anyway. 

  timelineData(){
    return {
      content: this.name,
      start: this.start,
      end: this.end
    }
  }  

  secondsToTime(start, duration){
    return Moment(this.start).add(duration, 's').toDate()
  }


}