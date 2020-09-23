import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import SpellsApi from '../api/spellsApi'

// This will get the appropriate class data passed to it thorugh props
// to generate the needed buttons. It's better than doing 8 API calls when I can just
// tie it to parent load state. 

// New API route will need to be put in to place for this. Can use a simple reference in an array 
// to retrieve the relevant spells.

export default class ClassSpells extends React.Component {
  constructor(props){
    super()
    this.state = { spells: undefined, isLoading: true, className: props.className }
  }

  componentDidMount(){
    SpellsApi.all().then((data)=>{
      // this.setState({spells: data})
      // this.setState({isLoading: false})
    })
  }

  render(){
    const {isLoading, playerClasses} = this.state

    if(isLoading){
      return <div className="App">Loading...</div>;
    }

    // let playerClassElements = []
    // for(let i = 0; i < playerClasses.length; i++){
    //   let pc = playerClasses[i]
    //   playerClassElements.push(
    //     <button key={pc.name} className={pc.name.toLowerCase() + " class-button"} >{pc.name}</button>
    //   )
    // }

    return <div id='class-name-spells'>

    </div>
  }
}

