import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie, Doughnut, Radar, PolarArea, Bubble, Scatter } from 'react-chartjs-2';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "./Header";
import Footer from "./Footer";
import ButtonGradient from "../assets/svg/ButtonGradient";
import { CSSTransition } from 'react-transition-group';
import Swal from 'sweetalert2';
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
  const [chartType, setChartType] = useState('None');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inProp, setInProp] = useState(false);
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [columns, setColumns] = useState([]);
  const [generateClicked, setGenerateClicked] = useState(false);

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

  if (loading) return <div>Loading...</div>;
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
              className="generate-button bg-blue-500 text-white"
              onClick={handleGenerate}
            >
              Generate
            </button>
            <button 
              className="download-button bg-green-500 text-white mt-2"
              onClick={() => handleDownload('csv')}
            >
              Download CSV
            </button>
            <button 
              className="download-button bg-red-500 text-white mt-2"
              onClick={() => handleDownload('chart')}
            >
              Download Chart
            </button>
          </div>

          <div className="chart-container lg:w-2/3 p-4">
            <CSSTransition in={generateClicked} timeout={300} classNames="fade" unmountOnExit>
              <div className="chart-wrapper">
                {!chartData && !generateClicked ? (
                  <div className="text-center text-gray-500">
                    Please select columns and chart type to generate chart
                  </div>
                ) : (
                  <SelectedChart data={chartData} options={chartOptions} />
                )}
              </div>
            </CSSTransition>
          </div>
        </div>

        <div className="button-group mt-8 lg:space-x-4">
          <button onClick={back} className="back-button bg-gray-600 text-white">
            Back to Home
          </button>
          <button onClick={goToDashboard} className="go-dashboard-button bg-purple-600 text-white">
            Go to Dashboard
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Visualise;
