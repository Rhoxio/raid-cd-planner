import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Timeline from 'react-visjs-timeline'
import ClassForm from './classForm';
import Moment from 'moment';
import $ from 'jquery'

class CooldownTimeline extends React.Component {
  constructor(){
    super()
    this.timelineRef = React.createRef()

    this.state = {}
    this.state.startDate = new Date(0)
    this.state.endDate = Moment(this.state.startDate).add(10, 'm').toDate();
    this.state.options = {
      start: this.state.startDate,
      end: this.state.endDate,
      min: this.state.startDate,
      max: this.state.endDate,
      editable: true,
      onRemove: ((item, cb)=>{
        let check = window.confirm(`Delete ${item.content}?`)
        if(check == true){
          this.removeItem(item)
          cb(item)          
        }
      }),
      align: 'range',
      showMajorLabels: false,
      showMinorLabels: true, 
      snap: (date) => {
        return Math.round(date / 1000) * 1000;
      }, 
      format: {
        minorLabels: {
          millisecond:'ss',
          second: 'm:ss',
          minute: 'm:ss',
          hour: 'm',
          weekday: 'ss',
          day: 'ss',
          week: 'ss',
          month: 'ss',
          year: 'ss'
        }
      }, 
      itemsAlwaysDraggable: {
        item: true,
        range: true,
      },
    }
    this.state.items = [{
      start: this.state.startDate,
      end: Moment(this.state.endDate).subtract(9, 'm').toDate(),
      content: 'Spirit Link Totem',
      min: this.state.startDate,
      max: this.state.endDate,      
      editable: true, 
      id: 1,
      group: 'shaman'
    }]  
    this.state.groups = [{
      id: 'shaman',
      content: 'Shaman',
    }]

  }

  setTimelineItems(){
    this.timelineRef.current.$el.setItems(this.state.items);
  }

  removeItem(removedItem){
    // UI removal logic is handled in onRemove function in options.
    this.setState({items: this.state.items.filter(function(item) { 
        return removedItem.id !== item.id 
    })});
  }

  // !!!!!!!!!!!
  // Will probably need to set up cb in options for
  // when items are moved around on the timeline and be sure that they
  // are updated in the state here.

  appendItem(){
    let newItem = {
      start: this.state.startDate,
      end: Moment(this.state.endDate).subtract(9, 'm').toDate(),
      content: 'Earthen Wall Totem',
      editable: true, 
      id: 2,
      group: 'shaman'
    }

    let items = this.state.items
    items.push(newItem)

    this.setState({items: items }, ()=>{
      this.setTimelineItems()  
    }) 
  }

  render(props){
    return <div className='timeline-container'>
    <ClassForm appendItem={this.appendItem.bind(this)} />
    <Timeline 
      ref={this.timelineRef}
      options={this.state.options} 
      items={this.state.items}
      groups={this.state.groups}
    />
    </div>
  }
}

export default CooldownTimeline;
