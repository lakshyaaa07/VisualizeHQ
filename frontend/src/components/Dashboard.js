import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';  // Import useLocation

const Dashboard = () => {
  const location = useLocation();  // Use useLocation to get the passed state
  const { fileId } = location.state || {};  // Destructure fileId from the state
  
  const [plotUrls, setPlotUrls] = useState([]); // Stores the URLs of generated plots
  const [cleanedCsvUrl, setCleanedCsvUrl] = useState(''); // URL for cleaned CSV file
  const [xColumn, setXColumn] = useState(''); // X-axis column for certain plots
  const [yColumn, setYColumn] = useState(''); // Y-axis column for certain plots
  const [columns, setColumns] = useState([]); // Available columns in the dataset

  useEffect(() => {
    if (fileId) {
      fetchColumns();  // Fetch columns once fileId is available
    }
  }, [fileId]);

  // Function to handle fetching available columns for x and y selection
  const fetchColumns = async () => {
    try {
      const response = await axios.get(`/api/files/${fileId}/view_csv_preview/`);
      if (response.data && response.data.columns) {
        setColumns(response.data.columns);
      }
    } catch (error) {
      console.error("Error fetching columns", error);
    }
  };

  // Function to handle plot generation
  const generatePlots = async (plotTypes) => {
    try {
      const response = await axios.post('/api/analyze_with_multiple_plots/', {
        file_id: fileId,
        plot_types: plotTypes,
        x_column: xColumn,
        y_column: yColumn
      });
      if (response.data && response.data.plot_urls) {
        setPlotUrls(response.data.plot_urls);
      }
    } catch (error) {
      console.error('Error generating plots', error);
    }
  };

  // Function to preview AI-generated plots
  const previewPlots = async () => {
    await generatePlots(['scatter', 'histogram', 'heatmap', 'bar']);
  };

  // Function to handle downloading cleaned CSV
  const downloadCleanedCsv = async () => {
    try {
      const response = await axios.post(`/api/analyze_csv_and_generate_models/`, {
        file_id: fileId,
        prompt: "clean csv"
      });
      if (response.data && response.data.cleaned_csv_url) {
        setCleanedCsvUrl(response.data.cleaned_csv_url);
      }
    } catch (error) {
      console.error('Error downloading cleaned CSV', error);
    }
  };

  return (
    <div className="dashboard">
      <h1 className="text-xl font-bold">Dashboard</h1>

      {/* Button to preview AI-generated plots */}
      <div className="mt-4">
        <button
          onClick={previewPlots}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Preview AI-generated Plots
        </button>
      </div>

      {/* Render the previewed plots */}
      <div className="plot-previews mt-4">
        {plotUrls.length > 0 ? (
          plotUrls.map((plotUrl, index) => (
            <div key={index} className="plot mt-2">
              <img src={plotUrl} alt={`Plot ${index + 1}`} className="w-full" />
              <a
                href={plotUrl}
                download
                className="bg-green-600 text-white px-4 py-2 mt-2 block rounded"
              >
                Download Plot {index + 1}
              </a>
            </div>
          ))
        ) : (
          <p>No plots generated yet. Click on 'Preview AI-generated Plots' to generate.</p>
        )}
      </div>

      {/* Button to download cleaned CSV */}
      <div className="mt-4">
        <button
          onClick={downloadCleanedCsv}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Download Cleaned CSV
        </button>
        {cleanedCsvUrl && (
          <a
            href={cleanedCsvUrl}
            download
            className="bg-green-600 text-white px-4 py-2 mt-2 block rounded"
          >
            Download Cleaned CSV
          </a>
        )}
      </div>

      {/* UI to select x and y columns */}
      <div className="xy-selection mt-4">
        <h2 className="text-lg font-bold">Select Columns for Plot</h2>
        <div className="mt-2">
          <label className="block">X-Axis Column</label>
          <select
            value={xColumn}
            onChange={(e) => setXColumn(e.target.value)}
            className="border rounded px-4 py-2 mt-1 w-full"
          >
            <option value="">Select X Column</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-2">
          <label className="block">Y-Axis Column</label>
          <select
            value={yColumn}
            onChange={(e) => setYColumn(e.target.value)}
            className="border rounded px-4 py-2 mt-1 w-full"
          >
            <option value="">Select Y Column</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
