import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "./Header";
import Footer from "./Footer";
import ButtonGradient from "../assets/svg/ButtonGradient";

const DisplayCSVData = () => {
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const location = useLocation();
    const { fileId } = location.state || {}; // Retrieve fileId passed from UploadFile.js

    const api = 'http://127.0.0.1:8000/api';

    useEffect(() => {
        if (fileId) {
            axios
                .get(`${api}/view_csv_preview/${fileId}/`)
                .then((response) => {
                    setPreviewData(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setLoading(false);
                });
        } else {
            setError("No file selected for preview");
            setLoading(false);
        }
    }, [fileId]);

    const back = () => {
        navigate("/");
    };

    const handleVisualise = () => {
        navigate(`/visualise`, { state: { fileId } }); // Pass the fileId
    };

    if (loading) return <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>;
    if (error) return <div className="text-center text-red-500 dark:text-red-400">Error: {error}</div>;

    return (
        <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header/>
        <div className="p-4 max-w-screen-xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 dark:text-gray-100">CSV Preview</h2>
            {previewData && (
                <div className="overflow-x-auto mx-4 sm:mx-8 lg:mx-16">
                    <table className="min-w-full bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-600">
                        <thead className="bg-gray-800 text-white dark:bg-gray-700">
                            <tr>
                                {Object.keys(previewData.data[0] || {}).map((key) => (
                                    <th key={key} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider dark:text-gray-200">
                                        {key}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-600">
                            {previewData.data.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, idx) => (
                                        <td key={idx} className="px-6 py-4 whitespace-nowrap dark:text-gray-100">
                                            {value}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 p-4 mt-4 rounded dark:bg-yellow-800 dark:text-yellow-300 dark:border-yellow-600">
                        Rows removed: {previewData.rows_removed}
                    </div>
                </div>
            )}
            <div className="flex justify-center mt-6 space-x-4">
                <button 
                    type="button" 
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105 dark:bg-blue-600 dark:hover:bg-blue-700"
                    onClick={back}
                >
                    Home
                </button>
                <button 
                    type="button" 
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105 dark:bg-green-600 dark:hover:bg-green-700"
                    onClick={handleVisualise}
                >
                    Visualize
                </button>
            </div>
        </div>
        <Footer/>
        <ButtonGradient/>
        </div>
    );
};

export default DisplayCSVData;
