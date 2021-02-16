import React, { useState } from 'react';
import logo from './logo.svg';
import relativity from './relativity.jpeg';
import codebase from './cb-logo.png';
import './App.css';

import SingleValue from './components/SingleValue'
import TripleValue from './components/TripleValue'

function Engines() {
  const [clicked, setClicked] = useState(false)
  if (clicked) {
    return <TripleValue url="http://localhost:3000/engines" name="Engines"/>
  }
  return (
    <button onClick={() => setClicked(true)}>Visualize Engine Data</button>
  )
}

function App() {
  return (
    <div className="App">
      <h1>Relativity Ramp Up Project</h1>
      <h3>Laryn Qi</h3>
      <img src={relativity} alt="Relativity" style={{position: "absolute", top: "0px", left: "0px", height: "50px", width: "50px"}}></img>
      <img src={codebase} alt="Codebase" style={{position: "absolute", top: "0px", right: "0px", height: "50px", width: "50px"}}></img>
      <SingleValue url="http://localhost:3000/altitude" name="Altitude"/>
      <SingleValue url="http://localhost:3000/acceleration" name="Acceleration"/>
      <Engines />
      {/* https://stackoverflow.com/questions/39857425/react-page-keep-footer-at-the-bottom-of-the-page */}
      <div style={{paddingBottom: "60px"}}>
        <footer style={{position: "absolute", left: "0", bottom: "0", right: "0"}}></footer>
      </div>
    </div>
  );
}

export default App;
