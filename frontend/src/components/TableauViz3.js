import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // To navigate back

function TableauViz3() {
  const vizRef = useRef(null); // Use ref to store the viz object
  const navigate = useNavigate(); // For handling the back navigation

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://public.tableau.com/javascripts/api/tableau-2.min.js';

    script.async = true;
    script.onload = () => {
      initViz();
    };
    document.body.appendChild(script);

    const initViz = () => {
      const containerDiv = document.getElementById('tableauViz3');
      // const url = "https://public.tableau.com/views/Sales_17088317970720/SalesDashboard";
    const url="https://public.tableau.com/views/SalesDashboardTemplate/ExecutiveOverview"

      const options = {
        width: '5000px',  // Full width
        height: '800px', // Adjusted height
      };

      // Check if there's already a viz in the container and destroy it
      if (vizRef.current) {
        vizRef.current.dispose();  // This removes the previous viz
      }

      // Initialize a new Tableau viz and store it in the ref
      vizRef.current = new window.tableau.Viz(containerDiv, url, options);
    };

    // Clean up on component unmount
    return () => {
      if (vizRef.current) {
        vizRef.current.dispose();
      }
    };
  }, []);

  // Handling back navigation
  const handleBack = () => {
    navigate(-1); // Navigates to the previous page
  };

  return (
    <div className="pt-[4.75rem] lg:pt-[8.25rem] overflow-hidden">
      <div className="container mx-auto p-6 transition-opacity justify-center duration-300 ease-in-out dark:bg-gray-900 dark:text-gray-100">
        <button
          onClick={handleBack}
          className="bg-orange-500 justify-center text-white px-4 py-2 rounded hover:bg-orange-600 transition-transform transform hover:scale-105 mb-6"
        >
          Go Back
        </button>
        <div id="tableauViz3" className="w-full flex justify-center items-center"></div>
      </div>
    </div>
  );
}

export default TableauViz3;