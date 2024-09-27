// TableauDashboards.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TableauViz from './TableauViz';
import TableauViz2 from './TableauViz2';
import TableauViz3 from './TableauViz3';
import TableauViz4 from './TableauViz4';
import TableauViz5 from './TableauViz5';
import Navbar from '../sections/Header' 
import Footer from '../sections/Footer';

const TableauDashboards = () => {
  const navigate = useNavigate();

  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-extrabold mb-4 text-center">Tableau Dashboard</h2>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
        {/* <button
          className="bg-indigo-500 text-white px-6 py-3 rounded-full hover:bg-indigo-600 transition-transform transform hover:scale-105"
          onClick={() => navigate('/tableau-viz')}
        >
          Tableau Dashboard 1
        </button> */}
        
        <TableauViz/>
       
       <TableauViz2/>
      <TableauViz3/>
      <TableauViz4/>
      <TableauViz5/>
      {/* </div> */}
    </div>
    <Footer/>
    </>
  );
};

export default TableauDashboards;