import './App.css';
import {useState,useEffect} from 'react';
// import DisplayCSVData from './components/DisplayCSVData';



function App() {
  const fileId = 1;

  return (
    <div className="App">

      <header className="App-header">
        <h1>CSV Viewer</h1>
        {/* <DisplayCSVData fileId={fileId} /> */}
      </header>
    </div>
  );
}

export default App;
