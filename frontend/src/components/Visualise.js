import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie, Doughnut, Radar, PolarArea, Bubble, Scatter } from 'react-chartjs-2';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import Swal from 'sweetalert2'; // SweetAlert2 for better alert
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
  const [chartType, setChartType] = useState('None'); // Default to 'None'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inProp, setInProp] = useState(false);
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [columns, setColumns] = useState([]);
  const [generateClicked, setGenerateClicked] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Example state for dark mode

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
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      setError('No file selected for visualization');
      setLoading(false);
    }
  }, [fileId]);

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  const handleColumnChange = (e) => {
    const { name, value } = e.target;
    if (name === 'xColumn') {
      setXColumn(value);
    } else if (name === 'yColumn') {
      setYColumn(value);
    }
  };

  const handleGenerate = () => {
    if (!xColumn || !yColumn || chartType === 'None') {
      Swal.fire('Please select all the fields and chart type');
      return;
    }

    // Fetch the data again to generate the chart with selected columns
    axios
      .get(`${api}/view_csv_preview/${fileId}/`)
      .then((response) => {
        const data = response.data.data;
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
        setGenerateClicked(true);
        setInProp(false);
        setTimeout(() => {
          setInProp(true);
        }, 100);
      })
      .catch((error) => {
        Swal.fire('Error fetching data for chart');
      });
  };

  const back = () => {
    navigate('/');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Configure the chart options dynamically based on the theme
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#E0E0E0' : '#333', // Legend text color
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
        backgroundColor: darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)', // Tooltip background color
        titleColor: darkMode ? '#E0E0E0' : '#333', // Tooltip title color
        bodyColor: darkMode ? '#E0E0E0' : '#333', // Tooltip body color
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? '#E0E0E0' : '#333', // X-axis label color
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)', // X-axis grid color
        },
      },
      y: {
        ticks: {
          color: darkMode ? '#E0E0E0' : '#333', // Y-axis label color
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)', // Y-axis grid color
        },
      },
    },
  };

  const SelectedChart = chartTypes[chartType] || (() => <div>Select a chart type</div>);

  return (
    <div className={`visualise-container p-4 lg:flex lg:flex-col lg:items-center ${darkMode ? 'dark' : ''}`}>
      <h2 className="text-3xl font-bold mb-6 text-center">CSV Data Visualization</h2>

      <div className="lg:flex lg:space-x-6 lg:justify-between w-full">
        <div className="selection-container lg:w-1/3 p-4 border-2 border-gray-300 rounded-lg bg-white dark:border-gray-600 dark:bg-gray-800">
          <label htmlFor="xColumn" className="block mb-2 dark:text-gray-300">Select X-axis Column:</label>
          <select
            id="xColumn"
            name="xColumn"
            value={xColumn}
            onChange={handleColumnChange}
            className="form-select dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 w-full mb-4"
          >
            <option value="">--Select--</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>

          <label htmlFor="yColumn" className="block mb-2 dark:text-gray-300">Select Y-axis Column:</label>
          <select
            id="yColumn"
            name="yColumn"
            value={yColumn}
            onChange={handleColumnChange}
            className="form-select dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 w-full mb-4"
          >
            <option value="">--Select--</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>

          <label htmlFor="chartType" className="block mb-2 dark:text-gray-300">Select Chart Type:</label>
          <select
            id="chartType"
            value={chartType}
            onChange={handleChartTypeChange}
            className="form-select dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 w-full mb-4"
          >
            <option value="None">None</option>
            {Object.keys(chartTypes).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <button 
            className="generate-button bg-blue-500 text-white"
            onClick={handleGenerate}
          >
            Generate
          </button>
        </div>

        <div className="chart-container lg:w-2/3 p-4">
          <CSSTransition in={generateClicked} timeout={300} classNames="fade" unmountOnExit>
            <div className="chart-wrapper">
              {!chartData && !generateClicked ? (
                <div className="text-center text-gray-500 dark:text-gray-300">
                  Please select X and Y elements to analyze your data
                </div>
              ) : (
                chartData && <SelectedChart data={chartData} options={chartOptions} />
              )}
            </div>
          </CSSTransition>
        </div>
      </div>

      <button onClick={back} className="bg-info text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 mt-6 dark:bg-gray-700 dark:text-gray-200">
        Back to Home
      </button>
    </div>
  );
};

export default Visualise;
