// // import React,{useRef,useEffect} from "react";

// // const {tableau} = window;

// // function Tableau(){
// //     const url = "https://public.tableau.com/views/LearnEmbeddedAnalytics/SalesOverviewDashboard"
// //   const ref=useRef(null);
// // //   console.log(ref)

// //   function initViz() {
// //    new tableau.Viz(ref.current,url);
// //         }

// // useEffect(()=>{
// //             initViz()
// //         },[])
// //     return  (
// //    <div>
// //     <p>this is my tableau dashboard</p>
// //     <div ref={ref}></div>
// //         </div>
// //    )
// // }

// // export default Tableau;
// // import React, { useState, useEffect, useRef } from "react";
// // const { tableau } = window;

// // function Tableau(props) {
// //   const [url] = useState(
// //     "https://public.tableau.com/views/RegionalSampleWorkbook/Storms"
// //   );
// //   const ref = useRef(null);

// //   const initViz = () => {
// //     new tableau.Viz(ref.current, url);
// //   };

// //   useEffect(initViz, []);

// //   return (
// //     <div>
// //       {/* <h1>{props.location.state.title}</h1> */}
// //       <div style={setVizStyle} ref={ref} />
// //     </div>
// //   );
// // }

// // const setVizStyle = {
// //   width: "800px",
// //   height: "700px",
// // };

// // export default Tableau;
// import React, { useEffect, useRef } from 'react';
// import Header from "./Header";
// import Footer from "./Footer";

// function TableauViz() {
//   const vizRef = useRef(null); // Use ref to store the viz object

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://public.tableau.com/javascripts/api/tableau-2.min.js';

//     script.async = true;
//     script.onload = () => {
//       initViz();
//     };
//     document.body.appendChild(script);

    
//     const initViz = () => {
//       const containerDiv = document.getElementById('tableauViz');
//       // const url = "https://public.tableau.com/views/LearnEmbeddedAnalytics/SalesOverviewDashboard";
//       const url="https://public.tableau.com/views/Sales_17088317970720/SalesDashboard"
//       const options = {
//         width: '4000px',
//         height: '850px',
        
//       };

//       // Check if there's already a viz in the container and destroy it
//       if (vizRef.current) {
//         vizRef.current.dispose();  // This removes the previous viz
//       }

//       // Initialize a new Tableau viz and store it in the ref
//       vizRef.current = new window.tableau.Viz(containerDiv, url, options);
//     };

//     // Clean up on component unmount
//     return () => {
//       if (vizRef.current) {
//         vizRef.current.dispose();
//       }
//     };
//   }, []);

//   return <div id="tableauViz"></div>;
// }

// export default TableauViz;
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // To navigate back
import Header from "./Header";
import Footer from "./Footer";

function TableauViz() {
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
      const containerDiv = document.getElementById('tableauViz');
      const url = "https://public.tableau.com/views/Sales_17088317970720/SalesDashboard";
      const options = {
        width: '5000px',  // Full width
        height: '850px', // Adjusted height
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
      <Header />
      <div className="container mx-auto p-6 transition-opacity justify-center duration-300 ease-in-out dark:bg-gray-900 dark:text-gray-100">
        <button
          onClick={handleBack}
          className="bg-blue-500 justify-center text-white px-4 py-2 rounded hover:bg-blue-600 transition-transform transform hover:scale-105 mb-6"
        >
          Go Back
        </button>
        <div id="tableauViz" className="w-full flex justify-center items-center"></div>
      </div>
      <Footer />
    </div>
  );
}

export default TableauViz;
