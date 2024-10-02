import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import UploadFile from './components/UploadFile';
import DisplayCSVData from './components/DisplayCSVData';
import Visualise from './components/Visualise';
import Signup from './components/Signup';
import Login from './components/Login';
import Logout from './components/Logout';
import TableauViz from './components/TableauViz';
import DisplayInsights from './components/DisplayInsights';
import Dashboard from './components/Dashboard'; // Import Dashboard
import TableauDashboards from './components/TableauDashboard';
import { AuthProvider } from './components/AuthContext'; // Import your AuthProvider

function Index() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route exact path="/upload" element={<UploadFile />} />
        <Route exact path="/" element={<App />} />
        <Route exact path="/preview" element={<DisplayCSVData />} />
        <Route path="/display-insights" element={<DisplayInsights />} />
        <Route exact path="/visualise" element={<Visualise />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/tableau-viz" element={<TableauViz />} />
        <Route path="/tableau-dashboards" element={<TableauDashboards/>} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* New route for Dashboard */}
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);

reportWebVitals();
