import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie, Doughnut, Radar, PolarArea, Bubble, Scatter } from 'react-chartjs-2';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../sections/Header';
import Footer from '../sections/Footer';
import { CSSTransition } from 'react-transition-group';
import Swal from 'sweetalert2';
import './Visualise.css';
import HypnoticLoader from './HypnoticLoader';

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
  const [chartType, setChartType] = useState('None');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inProp, setInProp] = useState(false);
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [columns, setColumns] = useState([]);
  const [generateClicked, setGenerateClicked] = useState(false);
  const [generatingChart, setGeneratingChart] = useState(false);

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

  const handleTableauPageRedirect = () => {
    navigate('/tableau-dashboards'); 
  };

  const handleGenerate = () => {
    if (!xColumn || !yColumn || chartType === 'None') {
      Swal.fire('Please select all the fields and chart type');
      return;
    }

    setGeneratingChart(true);

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
              pointBackgroundColor: 'rgba(75,192,192,1)',
              fill: true,
              tension: 0.4,
            },
          ],
        });

        setGenerateClicked(true);
        setInProp(false);
        setGeneratingChart(false);
        setTimeout(() => {
          setInProp(true);
        }, 100);
      })
      .catch((error) => {
        Swal.fire('Error fetching data for chart');
        setGeneratingChart(false);
      });
  };

  const back = () => {
    navigate('/');
  };

  const goToDashboard = () => {
    navigate('/dashboard', { state: { fileId } }); 
  };
  

  const handleDownload = (type) => {
    if (type === 'csv') {
      window.location.href = `${api}/files/${fileId}/`; 
    } else if (type === 'chart') {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'chart.png';
        link.click();
      } else {
        Swal.fire('No chart available to download');
      }
    }
  };

  if (loading) return <div><HypnoticLoader loadingText="Hold on, data is fetching..." /></div>;
  if (error) return <div>Error: {error}</div>;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#333',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        titleColor: '#333',
        bodyColor: '#333',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#333',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#333',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const SelectedChart = chartTypes[chartType] || (() => <div>Select a chart type</div>);

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      <div className="visualise-container p-4 lg:flex lg:flex-col lg:items-center">
        <h2 className="text-3xl font-bold mb-6 text-center">CSV Data Visualization</h2>
  
        <div className="lg:flex lg:space-x-6 lg:justify-between w-full">
          <div className="selection-container lg:w-1/3 p-4 border-2 border-gray-300 rounded-lg bg-white">
            <label htmlFor="xColumn" className="block mb-2">Select X-axis Column:</label>
            <select
              id="xColumn"
              name="xColumn"
              value={xColumn}
              onChange={handleColumnChange}
              className="form-select w-full mb-4"
            >
              <option value="">--Select--</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
  
            <label htmlFor="yColumn" className="block mb-2">Select Y-axis Column:</label>
            <select
              id="yColumn"
              name="yColumn"
              value={yColumn}
              onChange={handleColumnChange}
              className="form-select w-full mb-4"
            >
              <option value="">--Select--</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
  
            <label htmlFor="chartType" className="block mb-2">Select Chart Type:</label>
            <select
              id="chartType"
              value={chartType}
              onChange={handleChartTypeChange}
              className="form-select w-full mb-4"
            >
              <option value="None">None</option>
              {Object.keys(chartTypes).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
  
            <button 
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={handleGenerate}
            >
              Generate
            </button>
            <button 
              className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={() => handleDownload('csv')}
            >
              Download CSV
            </button>
            <button 
              className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={() => handleDownload('chart')}
            >
              Download Chart
            </button>
          </div>
  
          <div className="chart-container lg:w-2/3 p-4">
            {generatingChart ? (
              <div className="flex justify-center items-center h-full">
                <HypnoticLoader loadingText="Generating chart, please wait..." />
              </div>
            ) : (
              <CSSTransition in={generateClicked} timeout={300} classNames="fade" unmountOnExit>
                <div className="chart-wrapper">
                  {!chartData ? (
                    <div className="text-center text-gray-500">
                      Please select columns and chart type to generate a chart
                    </div>
                  ) : (
                    <SelectedChart data={chartData} options={chartOptions} />
                  )}
                </div>
              </CSSTransition>
            )}
          </div>
        </div>
  
        <div className="button-group mt-8 lg:space-x-4">
          <button onClick={back} className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
            Back to Home
          </button>
          <button onClick={goToDashboard} className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
            Go to Dashboard
          </button>
          <button
            className="bg-indigo-500 text-white px-6 py-3 rounded-full w-full hover:bg-indigo-600 transition-transform transform hover:scale-105 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            onClick={handleTableauPageRedirect}
          >
            View Tableau Dashboard
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
  
};

export default Visualise;
