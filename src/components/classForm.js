import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import PlayerClassApi from '../api/playerClassApi'

class ClassForm extends React.Component {
  constructor(){
    super()
    this.state = { playerClasses: undefined, isLoading: true }
  }

  componentDidMount(){
    PlayerClassApi.all().then((data)=>{
      this.setState({playerClasses: data})
      this.setState({isLoading: false})
    })
  }

  render(){
    const {isLoading, playerClasses} = this.state
    if(isLoading){
      return <div className="App">Loading...</div>;
    }

    let playerClassElements = []
    for(let i = 0; i < playerClasses.length; i++){
      let pc = playerClasses[i]
      playerClassElements.push(
        <button key={pc.name} className={pc.name.toLowerCase() + " class-button"} >{pc.name}</button>
      )
    }

    return <div id='class-form'>

      <div id='class-selection'>
        {playerClassElements}
      </div>

      <input id='class-name' type='text'/>
      <button onClick={this.props.appendItem} >Click This Thing</button>
    </div>
  }
}

export default ClassForm;