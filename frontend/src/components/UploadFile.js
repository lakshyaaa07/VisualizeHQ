import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UploadFile.css';

const AuthContext = createContext();

function UploadFile() {
    const [filename, setFilename] = useState(null);
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate(); // useNavigate hook for navigation
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('tokens')); // Check login status
    const [user, setUser] = useState(null);
    const [tokens, setTokens] = useState(() => localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')) : null);

    const api = 'http://127.0.0.1:8000/api';

    const saveFile = () => {
        if (!filename) return; // Ensure a file is selected

        let formData = new FormData();
        formData.append('csv', filename);

        let axiosConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        axios.post(api + '/files/', formData, axiosConfig)
            .then((response) => {
                setStatus('File Uploaded Successfully');
                getFiles(); // Refresh the file list after upload
            })
            .catch((error) => {
                console.log(error);
                setStatus('Error Uploading File');
            });
    };

    const getFiles = () => {
        axios.get(api + '/files/')
            .then((response) => {
                setFiles(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getFiles();
        // Add transition effect on page load
        document.body.classList.add('transition-opacity');
        setTimeout(() => {
            document.body.classList.remove('transition-opacity');
        }, 300);
        // Check dark mode preference on page load
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark');
            setIsDarkMode(true);
        }
    }, []);

    const handlePreviewRedirect = (fileId) => {
        navigate(`/preview`, { state: { fileId } });
    };

    const toggleTheme = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        if (newDarkMode) {
            document.body.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    };

    const downloadWithAxios = (url, title) => {
        axios({
            method: 'get',
            url,
            responseType: 'arraybuffer',
        })
        .then((response) => {
            forceDownload(response, title);
        })
        .catch((error) => console.log(error));
    };

    const forceDownload = (response, title) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', title + '.csv');
        document.body.appendChild(link);
        link.click();
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post(api + '/login/', { username, password });
            setTokens(response.data);
            localStorage.setItem('tokens', JSON.stringify(response.data));
            setUser(username);
            setIsLoggedIn(true); // Update login status
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const signup = async (username, password) => {
        try {
            await axios.post(api + '/signup/', { username, password });
            await login(username, password); // Automatically log in after signup
        } catch (error) {
            console.error('Signup failed:', error);
        }
    };

    const logout = async () => {
        try {
            await axios.post(api + '/logout/', { refresh: tokens.refresh });
            setTokens(null);
            setUser(null);
            localStorage.removeItem('tokens');
            setIsLoggedIn(false); // Update login status
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="container mx-auto p-6 transition-opacity duration-300 ease-in-out dark:bg-gray-900 dark:text-gray-100">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-extrabold mb-4">VISTAS x VISUALIZE</h2>
                <button
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-300 transition-transform transform hover:scale-105 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                    id="themeToggle"
                    onClick={toggleTheme}
                >
                    {isDarkMode ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3v1M12 20v1M4.22 4.22l.707.707M17.07 17.07l.707.707M3 12h1M20 12h1M4.22 19.78l.707-.707M17.07 6.93l.707-.707" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.41 1.41M17.07 17.07l1.41 1.41M1 12h2M21 12h2M4.22 19.78l1.41-1.41M17.07 6.93l1.41-1.41" />
                        </svg>
                    )}
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
            <div className="text-center mb-4">
                {!isLoggedIn ? (
                    <>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mx-2 hover:bg-blue-600"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded mx-2 hover:bg-gray-600"
                            onClick={() => navigate('/signup')}
                        >
                            Signup
                        </button>
                    </>
                ) : (
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded mx-2 hover:bg-red-600"
                        onClick={logout}
                    >
                        Logout
                    </button>
                )}
            </div>
            {isLoggedIn && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1">
                        <div className="bg-white shadow-lg rounded-lg p-8 transition-transform transform hover:scale-105 dark:bg-gray-800 dark:text-gray-100">
                            <h4 className="text-2xl font-semibold mb-4">CSV File Upload</h4>
                            <form>
                                <div className="mb-6">
                                    <label htmlFor="fileInput" className="block text-gray-700 mb-2 text-sm font-medium dark:text-gray-300">
                                        Browse CSV File
                                    </label>
                                    <input
                                        type="file"
                                        accept=".csv, .xlsx"
                                        onChange={(e) => setFilename(e.target.files[0])}
                                        id="fileInput"
                                        className="border border-gray-300 rounded-md p-3 w-full bg-gray-50 file:border-gray-300 file:bg-gray-200 file:text-gray-700 file:py-2 file:px-4 file:rounded-md file:cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:file:border-gray-600 dark:file:bg-gray-800 dark:file:text-gray-300"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={saveFile}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-full w-full hover:bg-blue-600 transition-transform transform hover:scale-105 dark:bg-blue-600 dark:hover:bg-blue-700"
                                >
                                    Submit
                                </button>
                                {status && (
                                    <div className="bg-blue-100 text-blue-800 border border-blue-300 p-4 mt-4 rounded-lg dark:bg-blue-700 dark:text-blue-200 dark:border-blue-600">
                                        {status}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="bg-white shadow-lg rounded-lg p-8 dark:bg-gray-800">
                            <h4 className="text-2xl font-semibold mb-4 dark:text-gray-100">Uploaded Datasets</h4>
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Dataset Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Download
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Preview
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800">
                                    {files.map((file, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {file.csv}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                <button
                                                    onClick={() => downloadWithAxios(file.csv, file.id)}
                                                    className="bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-600 transition-transform transform hover:scale-105 dark:bg-green-600 dark:hover:bg-green-700"
                                                >
                                                    Download
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                <button
                                                    onClick={() => handlePreviewRedirect(file.id)}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition-transform transform hover:scale-105 dark:bg-blue-600 dark:hover:bg-blue-700"
                                                >
                                                    View CSV Preview
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UploadFile;