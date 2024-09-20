import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import '../src/resources/css/bootstrap.min.css'
import App from './App';
// import Home from './components/Home';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import UploadFile from './components/UploadFile'
import DisplayCSVData from './components/DisplayCSVData';
import Visualise from './components/Visualise';
import Signup from './components/Signup';
import Login from './components/Login';
import Logout from './components/Logout';
import TableauViz from './components/TableauViz';
// import { AuthProvider } from './context/Auth';

// import './global.css';


function Index(){
  return(
    <BrowserRouter>
        <Routes>
          <Route exact path="/upload" element={<UploadFile />} />
          <Route exact path="/" element={<App />} />
          <Route exact path="/preview" element={<DisplayCSVData />} />
          <Route exact path="/visualise" element={<Visualise />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/tableau-viz" element={<TableauViz />} />

        </Routes>
    </BrowserRouter>
    
  );
}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();  