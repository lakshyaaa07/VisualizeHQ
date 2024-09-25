import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "./Header";
import Footer from "./Footer";
import ButtonGradient from "../assets/svg/ButtonGradient";
import CodeBlock from './CodeBlock'; // Import CodeBlock component
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown

const DisplayCSVData = () => {
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const location = useLocation();
    const { fileId } = location.state || {}; // Retrieve fileId passed from UploadFile.js

    const api = 'http://127.0.0.1:8000/api';
    
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(20); // Number of rows to display per page

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

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = previewData?.data.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil((previewData?.data.length || 0) / rowsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
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
                                {currentRows.map((row, index) => (
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
                        <div className="bg-blue-100 text-blue-800 border border-blue-300 p-4 mt-4 rounded dark:bg-blue-800 dark:text-blue-300 dark:border-blue-600">
                            <h3 className="font-bold">AI Cleaning Suggestions:</h3>
                            {/* Render the AI cleaning suggestions in markdown format */}
                            <ReactMarkdown 
                                components={{
                                    code: ({node, inline, className, children, ...props}) => (
                                        <CodeBlock code={String(children)} {...props} />
                                    )
                                }}
                            >
                                {previewData.ai_cleaning_suggestions}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
                <div className="flex justify-between mt-6">
                    <button 
                        type="button" 
                        className={`bg-gray-500 text-white px-4 py-2 rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        onClick={prevPage} 
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="self-center">Page {currentPage} of {totalPages}</span>
                    <button 
                        type="button" 
                        className={`bg-gray-500 text-white px-4 py-2 rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        onClick={nextPage} 
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
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
