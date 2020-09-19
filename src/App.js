import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Timeline from 'react-visjs-timeline'

function App() {
  const options = {
    width: '100%',
    height: '60px',
    stack: false,
    showMajorLabels: true,
    showCurrentTime: true,
    zoomMin: 1000000,
    type: 'background',
    format: {
      minorLabels: {
        minute: 'h:mma',
        hour: 'ha'
      }
    }
  }

  const items = [{
    start: new Date(2010, 7, 15),
    end: new Date(2010, 8, 2),  // end is optional
    content: 'Trajectory A',
  }]  


  const groups = [{
    id: 1,
    content: 'Group A',
  }]

  return (
    <Timeline 
    options={options} 
    items={items}
    groups={groups}
    />
  );
}

export default App;
