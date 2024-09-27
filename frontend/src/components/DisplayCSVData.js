import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DisplayCSVData.css';
import Header from '../sections/Header';
import Footer from '../sections/Footer';
import ButtonGradient from "../assets/svg/ButtonGradient";
import CodeBlock from './CodeBlock';
import ReactMarkdown from 'react-markdown';
import HypnoticLoader from './HypnoticLoader';
import { FaSearch, FaClipboard, FaInfoCircle } from "react-icons/fa";

const DisplayCSVData = () => {
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [filteredData, setFilteredData] = useState([]); // State for filtered data
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
                    setFilteredData(response.data.data); // Initialize filteredData with all data
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

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter the data based on the search query
        const filtered = previewData.data.filter((row) =>
            Object.values(row).some((value) =>
                String(value).toLowerCase().includes(query)
            )
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page after search
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Copied to clipboard!');
            })
            .catch((err) => {
                console.error('Could not copy text: ', err);
            });
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

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

    if (loading) return <div className="text-center text-gray-500 dark:text-gray-400"><HypnoticLoader loadingText="Hold on, magic is happening..." /></div>;
    if (error) return <div className="text-center text-red-500 dark:text-red-400">Error: {error}</div>;

    return (
        <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
            <Header />
            <div className="p-4 max-w-screen-xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-6 dark:text-gray-100">CSV Preview</h2>
                
                {/* Search Bar */}
                <div className="flex justify-center mb-4">
                    <div className="relative w-full max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg shadow-md border border-gray-300 focus:border-blue-400 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:focus:border-blue-600 dark:text-gray-100"
                        />
                    </div>
                </div>

                {previewData && (
                    <div className="overflow-x-auto mx-4 sm:mx-8 lg:mx-16">
                        <div className="overflow-y-auto max-h-96 custom-scrollbar">
                            <table className="min-w-full table-fixed bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-600">
                                <thead className="bg-gray-800 text-white dark:bg-gray-700">
                                    <tr>
                                        {Object.keys(previewData.data[0] || {}).map((key, index) => (
                                            <th key={index} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider dark:text-gray-200">
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-600">
                                    {currentRows.map((row, rowIndex) => (
                                        <tr key={rowIndex} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                            {Object.values(row).map((value, cellIndex) => (
                                                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap dark:text-gray-100">
                                                    {value}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 p-4 mt-4 rounded dark:bg-yellow-800 dark:text-yellow-300 dark:border-yellow-600">
                            Rows removed: {previewData.rows_removed}
                        </div>

                        {/* Pagination */}
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

                        {/* AI Cleaning Suggestions */}
                        <div className="bg-gradient-to-r from-blue-900 via-teal-900 to-blue-800 text-white p-4 mt-4 rounded-lg shadow-lg border dark:border-teal-600">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold mb-2 dark:text-teal-300 flex items-center">
                                    <FaInfoCircle className="mr-2" />
                                    AI Cleaning Suggestions:
                                </h3>
                                <button 
                                    onClick={() => copyToClipboard(previewData.ai_cleaning_suggestions)}
                                    className="bg-teal-600 text-white rounded-lg px-2 py-1 text-sm hover:bg-teal-700 transition duration-200"
                                    title="Copy to clipboard"
                                >
                                    <FaClipboard className="w-4 h-4 inline" />
                                </button>
                            </div>
                            <ReactMarkdown
                                components={{
                                    code: ({ node, inline, className, children, ...props }) => (
                                        <CodeBlock code={String(children)} {...props} />
                                    ),
                                }}
                            >
                                {previewData.ai_cleaning_suggestions}
                            </ReactMarkdown>
                        </div>

                    </div>
                )}

                {/* Navigation Buttons */}
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
            <Footer />
            <ButtonGradient />
        </div>
    );
};

export default DisplayCSVData;
