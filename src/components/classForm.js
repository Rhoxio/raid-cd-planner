import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Timeline from 'react-visjs-timeline'
import CooldownTimeline from './cooldownTimeline';
import Moment from 'moment';
import vis from 'vis';
import $ from 'jquery'

class ClassForm extends React.Component {
  constructor(){
    super()
  }

  render(){
    return <div id='class-form'>
    <input id='class-name' type='text'/>
    <button onClick={this.props.appendItem} >Click This Thing</button>
    </div>
  }
}

export default ClassForm;