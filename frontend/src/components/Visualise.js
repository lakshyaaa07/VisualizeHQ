// // // import React from 'react'

// // // const Visualise = () => {
// // //   return (
// // //     <div>Visualise</div>
// // //   )
// // // }

// // // export default Visualise

// // import React, { useEffect, useState } from 'react';
// // import { Line } from 'react-chartjs-2';
// // import axios from 'axios';
// // import { useLocation, useNavigate } from 'react-router-dom';
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   PointElement,
// //   LineElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// // } from 'chart.js';

// // ChartJS.register(
// //   CategoryScale,
// //   LinearScale,
// //   PointElement,
// //   LineElement,
// //   Title,
// //   Tooltip,
// //   Legend
// // );

// // const Visualise = () => {
// //   const [chartData, setChartData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const location = useLocation();
// //   const { fileId } = location.state || {}; // Retrieve fileId from state

// //   const navigate = useNavigate();

// //   const api = 'http://127.0.0.1:8000/api';

// //   useEffect(() => {
// //     if (fileId) {
// //       axios
// //         .get(`${api}/view_csv_preview/${fileId}/`)
// //         .then((response) => {
// //           const data = response.data.data;

// //           // Assuming the first row has the column headers
// //           const labels = data.map(row => row[Object.keys(row)[0]]); // First column as labels
// //           const values = data.map(row => row[Object.keys(row)[1]]); // Second column as data points

// //           setChartData({
// //             labels,
// //             datasets: [
// //               {
// //                 label: 'CSV Data',
// //                 data: values,
// //                 fill: false,
// //                 backgroundColor: 'rgba(75,192,192,1)',
// //                 borderColor: 'rgba(75,192,192,1)',
// //               },
// //             ],
// //           });
// //           setLoading(false);
// //         })
// //         .catch((error) => {
// //           setError(error.message);
// //           setLoading(false);
// //         });
// //     } else {
// //       setError('No file selected for visualization');
// //       setLoading(false);
// //     }
// //   }, [fileId]);

// //   const back = () => {
// //     navigate('/');
// //   };

// //   if (loading) return <div>Loading...</div>;
// //   if (error) return <div>Error: {error}</div>;

// //   return (
// //     <div>
// //       <h2>CSV Data Visualization</h2>
// //       {chartData && <Line data={chartData} />}
// //       <button onClick={back} className="btn btn-info mt-4">
// //         Back to Home
// //       </button>
// //     </div>
// //   );
// // };

// // export default Visualise;
// import React, { useEffect, useState } from 'react';
// import { Line, Bar, Pie, Doughnut, Radar, PolarArea, Bubble, Scatter } from 'react-chartjs-2';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { CSSTransition } from 'react-transition-group';
// import './Visualise.css';  // We'll add some CSS for transitions

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   RadialLinearScale,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   RadialLinearScale,
//   Title,
//   Tooltip,
//   Legend
// );

// const chartTypes = {
//   Line: Line,
//   Bar: Bar,
//   Pie: Pie,
//   Doughnut: Doughnut,
//   Radar: Radar,
//   PolarArea: PolarArea,
//   Bubble: Bubble,
//   Scatter: Scatter,
// };

// const Visualise = () => {
//   const [chartData, setChartData] = useState(null);
//   const [chartType, setChartType] = useState('Line');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [inProp, setInProp] = useState(false); // For handling transitions

//   const location = useLocation();
//   const { fileId } = location.state || {}; // Retrieve fileId from state
//   const navigate = useNavigate();

//   const api = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api'; // Using environment variable for API

//   useEffect(() => {
//     if (fileId) {
//       axios
//         .get(`${api}/view_csv_preview/${fileId}/`)
//         .then((response) => {
//           const data = response.data.data;

//           // Assuming the first column is labels (e.g., dates) and second column is data (e.g., values)
//           const labels = data.map(row => row[Object.keys(row)[0]]); // First column as labels
//           const values = data.map(row => row[Object.keys(row)[1]]); // Second column as data points

//           setChartData({
//             labels,
//             datasets: [
//               {
//                 label: 'CSV Data',
//                 data: values,
//                 backgroundColor: 'rgba(75,192,192,0.2)',
//                 borderColor: 'rgba(75,192,192,1)',
//                 borderWidth: 2,
//                 fill: true,
//                 tension: 0.4, // For smoother curves on the Line chart
//               },
//             ],
//           });
//           setLoading(false);
//           setInProp(true); // Trigger transition when chart data is loaded
//         })
//         .catch((error) => {
//           setError(error.message);
//           setLoading(false);
//         });
//     } else {
//       setError('No file selected for visualization');
//       setLoading(false);
//     }
//   }, [fileId]);

//   const handleChartTypeChange = (e) => {
//     setChartType(e.target.value);
//     setInProp(false); // Remove the previous chart from view
//     setTimeout(() => {
//       setInProp(true); // Re-render the new chart with transition
//     }, 100); // Adjust timeout if necessary for smoother transitions
//   };

//   const back = () => {
//     navigate('/');
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   const SelectedChart = chartTypes[chartType];

//   return (
//     <div className="visualise-container">
//       <h2>CSV Data Visualization</h2>

//       {/* Dropdown for selecting chart type */}
//       <div className="chart-selector">
//         <label htmlFor="chartType">Select Chart Type: </label>
//         <select
//           id="chartType"
//           value={chartType}
//           onChange={handleChartTypeChange}
//           className="form-select"
//         >
//           {Object.keys(chartTypes).map((type) => (
//             <option key={type} value={type}>
//               {type}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Chart with transition */}
//       <CSSTransition in={inProp} timeout={300} classNames="fade" unmountOnExit>
//         <div className="chart-wrapper">
//           {chartData && <SelectedChart data={chartData} options={{ responsive: true }} />}
//         </div>
//       </CSSTransition>

//       <button onClick={back} className="btn btn-info mt-4">
//         Back to Home
//       </button>
//     </div>
//   );
// };

// export default Visualise;

import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie, Doughnut, Radar, PolarArea, Bubble, Scatter } from 'react-chartjs-2';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import './Visualise.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const chartTypes = {
  Line: Line,
  Bar: Bar,
  Pie: Pie,
  Doughnut: Doughnut,
  Radar: Radar,
  PolarArea: PolarArea,
  Bubble: Bubble,
  Scatter: Scatter,
};

const Visualise = () => {
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('Line');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inProp, setInProp] = useState(false);
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [columns, setColumns] = useState([]);

  const location = useLocation();
  const { fileId } = location.state || {};
  const navigate = useNavigate();

  const api = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

  useEffect(() => {
    if (fileId) {
      axios
        .get(`${api}/view_csv_preview/${fileId}/`)
        .then((response) => {
          const data = response.data.data;
          const columnNames = Object.keys(data[0] || {});
          setColumns(columnNames);

          if (xColumn && yColumn) {
            const labels = data.map(row => row[xColumn]);
            const values = data.map(row => row[yColumn]);

            setChartData({
              labels,
              datasets: [
                {
                  label: `${yColumn} vs ${xColumn}`,
                  data: values,
                  backgroundColor: 'rgba(75,192,192,0.2)',
                  borderColor: 'rgba(75,192,192,1)',
                  borderWidth: 2,
                  fill: true,
                  tension: 0.4,
                },
              ],
            });
          }

          setLoading(false);
          setInProp(true);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      setError('No file selected for visualization');
      setLoading(false);
    }
  }, [fileId, xColumn, yColumn]);

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
    setInProp(false);
    setTimeout(() => {
      setInProp(true);
    }, 100);
  };

  const handleColumnChange = (e) => {
    const { name, value } = e.target;
    if (name === 'xColumn') {
      setXColumn(value);
    } else if (name === 'yColumn') {
      setYColumn(value);
    }
  };

  const back = () => {
    navigate('/');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const SelectedChart = chartTypes[chartType];

  return (
    <div className="visualise-container">
      <h2>CSV Data Visualization</h2>

      {/* Dropdowns for selecting columns */}
      <div className="chart-selector">
        <label htmlFor="xColumn">Select X-axis Column: </label>
        <select
          id="xColumn"
          name="xColumn"
          value={xColumn}
          onChange={handleColumnChange}
          className="form-select"
        >
          <option value="">--Select--</option>
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>

        <label htmlFor="yColumn">Select Y-axis Column: </label>
        <select
          id="yColumn"
          name="yColumn"
          value={yColumn}
          onChange={handleColumnChange}
          className="form-select"
        >
          <option value="">--Select--</option>
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>

        <label htmlFor="chartType">Select Chart Type: </label>
        <select
          id="chartType"
          value={chartType}
          onChange={handleChartTypeChange}
          className="form-select"
        >
          {Object.keys(chartTypes).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Chart with transition */}
      <CSSTransition in={inProp} timeout={300} classNames="fade" unmountOnExit>
        <div className="chart-wrapper">
          {chartData && <SelectedChart data={chartData} options={{ responsive: true }} />}
        </div>
      </CSSTransition>

      <button onClick={back} className="btn btn-info mt-4">
        Back to Home
      </button>
    </div>
  );
};

export default Visualise;