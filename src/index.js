import React from 'react';
import ReactDOM from 'react-dom';
// import CooldownTimeline from './components/cooldownTimeline';
import ClassForm from './components/classForm'
import CooldownTimeline from './components/cooldownTimeline';
import Moment from 'moment';
import vis from 'vis';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

// console.log()

ReactDOM.render(
  <CooldownTimeline />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
