// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../sections/Header';
// import Footer from '../sections/Footer';
// import axios from 'axios';
// import './UploadFile.css';
// import { MdDelete } from "react-icons/md";
// import { FaDownload } from "react-icons/fa";
// import CTA_Upload from './CTA_Upload';
// import { TbReportAnalytics } from "react-icons/tb";
// import { HiTableCells } from "react-icons/hi2";
// import { IoLogOut } from "react-icons/io5";



// function UploadFile() {
//     const [filename, setFilename] = useState(null);
//     const [files, setFiles] = useState([]);
//     const [username, setUsername] = useState(null);
//     const [status, setStatus] = useState('');
//     const navigate = useNavigate();
//     const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('tokens'));
//     const [selectedAnalysisType, setSelectedAnalysisType] = useState('');
//     const [user, setUser] = useState(null);
//     const [tokens, setTokens] = useState(() => localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')) : null);

//     const api = 'http://127.0.0.1:8000/api';

//     const analysisOptions = ['Summary Statistics', 'Trend Analysis', 'Correlation Matrix']; // Sample analysis types

//     const saveFile = () => {
//         if (!filename) return;

//         let formData = new FormData();
//         formData.append('csv', filename);

//         let axiosConfig = {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         };


//         axios.post(api + '/files/', formData, axiosConfig)
//             .then((response) => {
//                 setStatus('File Uploaded Successfully');
//                 getFiles();
//             })
//             .catch((error) => {
//                 console.log('Error uploading file:', error);
//                 setStatus('Error Uploading File');
//             });
//     };

//     const getFiles = () => {
//         axios.get(api + '/files/')
//             .then((response) => {
//                 setFiles(response.data);
//             })
//             .catch((error) => {
//                 console.log('Error fetching files:', error);
//             });
//     };

//     const handleTableauRedirect = () => {
//         navigate('/tableau-viz');
//     };

//     const getUsername = async () => {
//         try {
//             const response = await axios.get('/api/get-username/', {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//                 }
//             });
//             setUsername(response.data.username);
//         } catch (error) {
//             console.error('Error fetching username:', error);
//         }
//     };

//     useEffect(() => {
//         getUsername();
//         getFiles();
//         document.body.classList.add('transition-opacity');
//         setTimeout(() => {
//             document.body.classList.remove('transition-opacity');
//         }, 300);
//         const storedTokens = localStorage.getItem('tokens');
//         if (storedTokens) {
//             setIsLoggedIn(true);  // Set as logged in if tokens are present
//         } else {
//             setIsLoggedIn(false);
//         }
//     }, [tokens]);

//     const handleFilePreviewRedirect = (fileId) => {
//         navigate(`/preview`, { state: { fileId } });
//     };

//     const downloadWithAxios = (url, title) => {
//         axios({
//             method: 'get',
//             url,
//             responseType: 'arraybuffer',
//         })
//         .then((response) => {
//             forceDownload(response, title);
//         })
//         .catch((error) => console.log('Error downloading file:', error));
//     };

//     const forceDownload = (response, title) => {
//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', title + '.csv');
//         document.body.appendChild(link);
//         link.click();
//     };

//     // const login = async (username, password) => {
//     //     try {
//     //         const response = await axios.post(api + '/login/', { username, password });
//     //         setTokens(response.data);
//     //         localStorage.setItem('tokens', JSON.stringify(response.data));
//     //         setUser(username);
//     //         setIsLoggedIn(true);
//     //     } catch (error) {
//     //         console.error('Login failed:', error);
//     //     }
//     // };
//     const login = async (username, password) => {
//         try {
//             const response = await axios.post(api + '/login/', { username, password });
//             if (response.data && response.data.access) {
//                 setTokens(response.data);  // Set tokens state
//                 localStorage.setItem('tokens', JSON.stringify(response.data));  // Store tokens in localStorage
//                 setUser(username);  // Set user state
//                 setIsLoggedIn(true);  // Set logged-in status to true
//                 navigate('/');  // Redirect to home page or any other route
//             } else {
//                 console.error('Login failed: Invalid response data.');
//             }
//         } catch (error) {
//             console.error('Login failed:', error.response ? error.response.data : error.message);
//         }
//     };
    

//     const signup = async (username, password) => {
//         try {
//             await axios.post(api + '/signup/', { username, password });
//             await login(username, password);
//         } catch (error) {
//             console.error('Signup failed:', error);
//         }
//     };

//     const logout = async () => {
//         try {
//             await axios.post(api + '/logout/', { refresh: tokens.refresh });
//             setTokens(null);
//             setUser(null);
//             localStorage.removeItem('tokens');
//             setIsLoggedIn(false);
//         } catch (error) {
//             console.error('Logout failed:', error);
//         }
//     };
//     // Delete file from backend
//     const deleteFile = (fileId) => {
//         axios.delete(`${api}/files/${fileId}/`)
//             .then(() => {
//                 setStatus('File Deleted Successfully');
//                 getFiles(); // Refresh file list after deletion
//             })
//             .catch((error) => {
//                 console.log('Error deleting file:', error);
//                 setStatus('Error Deleting File');
//             });
//     };


        
//     const handleInsightsRedirect = (fileId, analysisType) => {
//         navigate('/display-insights', {
//             state: { fileId, analysisType }, // Pass fileId and selected analysis type
//         });
//     };


//     return (
//         <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
//             <Header />
//             <div className="container mx-auto p-6 transition-opacity duration-300 ease-in-out bg-gray-900 text-gray-100">
//                 <div className="text-center mb-4">
//                     {!isLoggedIn ? (
//                         <>
//                             <button
//                                 className="bg-teal-500 text-white px-4 py-2 rounded mx-2 hover:bg-teal-600"
//                                 onClick={() => navigate('/login')}
//                             >
//                                 Login
//                             </button>
//                             <button
//                                 className="bg-orange-500 text-white px-4 py-2 rounded mx-2 hover:bg-orange-600"
//                                 onClick={() => navigate('/signup')}
//                             >
//                                 Signup
//                             </button>
//                         </>
//                     ) : (
//                         <button
//                             className="bg-red-500 text-white px-4 py-2 rounded mx-2 hover:bg-red-600"
//                             onClick={() => navigate('/logout')}
//                         >
//                             <IoLogOut className='h-7 w-7'/>
//                         </button>
//                     )}
//                 </div>
//                 <div className="text-center mb-6">
//                     <h2 className="text-3xl font-extrabold mb-4">Upload your Dataset</h2>
//                 </div>
    
//                 {isLoggedIn && (
//                     <div className="flex flex-col items-center space-y-6">
//                         {/* Flex Container for CSV Upload and Analysis Select */}
//                         <div className="flex justify-between w-full max-w-4xl space-x-4">
//                             {/* CSV File Upload Section */}
//                             <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-8">
//                                 <h4 className="text-2xl font-semibold mb-4">CSV File Upload</h4>
//                                 <form>
//                                     <div className="mb-6">
//                                         <label htmlFor="fileInput" className="block text-gray-300 mb-2 text-sm font-medium">
//                                             Browse CSV File
//                                         </label>
//                                         <input
//                                             type="file"
//                                             accept=".csv, .xlsx"
//                                             onChange={(e) => setFilename(e.target.files[0])}
//                                             id="fileInput"
//                                             className="border border-gray-300 rounded-md p-3 w-full bg-gray-50 file:border-gray-300 file:bg-gray-200 file:text-gray-700 file:py-2 file:px-4 file:rounded-md file:cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:file:border-gray-600 dark:file:bg-gray-800 dark:file:text-gray-300"
//                                         />
//                                     </div>
//                                     <button
//                                         type="button"
//                                         onClick={saveFile}
//                                         className="bg-teal-500 text-white px-6 py-3 rounded-full w-full hover:bg-teal-600 transition-transform transform hover:scale-105"
//                                     >
//                                         Submit
//                                     </button>
//                                     {status && (
//                                         <div className="bg-teal-100 text-teal-800 border border-teal-300 p-4 mt-4 rounded-lg">
//                                             {status}
//                                         </div>
//                                     )}
//                                 </form>
//                             </div>
    
//                             {/* Analysis Type Section */}
//                             <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-8">
//                                 <h4 className="text-2xl font-semibold mb-4">Select Analysis Type</h4>
//                                 <div className="mb-6">
//                                     <label htmlFor="analysisSelect" className="block text-gray-300 mb-2 text-sm font-medium">
//                                         Select Analysis Type
//                                     </label>
//                                     <select
//                                         id="analysisSelect"
//                                         value={selectedAnalysisType}
//                                         onChange={(e) => setSelectedAnalysisType(e.target.value)}
//                                         className="border border-gray-600 rounded-md p-3 w-full bg-gray-700 text-gray-300"
//                                     >
//                                         <option value="">Select Analysis</option>
//                                         {analysisOptions.map((option, index) => (
//                                             <option key={index} value={option}>
//                                                 {option}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             </div>
//                         </div>
    
//                         {/* Uploaded Datasets Section */}
//                         <div className="w-full max-w-4xl bg-gray-800 shadow-lg rounded-lg p-8 mx-auto">
//     <h4 className="text-2xl font-semibold mb-4 text-white text-center">Uploaded Datasets</h4>
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {files.map((file, index) => (
//             <div 
//                 key={index} 
//                 className="bg-gray-700 rounded-lg p-6 shadow-md flex flex-col justify-between space-y-4 transform transition duration-300 hover:scale-105 hover:shadow-lg"
//             >
//                 {/* CSV title with wrapping */}
//                 <h5 className="text-lg font-bold text-gray-100 mb-4 break-words text-center">
//                     {file.csv.split('/').pop()}
//                 </h5>

//                 {/* Buttons Container */}
//                 <div className="grid grid-cols-2 gap-4">
//                     {/* Download Button */}
//                     <button
//                         onClick={() => downloadWithAxios(file.csv, file.id)}
//                         className="flex items-center justify-center bg-green-500 text-white p-2 rounded-full shadow hover:bg-green-600 transition-transform transform hover:scale-105"
//                         title="Download CSV"
//                     >
//                         <FaDownload className="w-5 h-5" />
//                     </button>

//                     {/* Preview Button */}
//                     <button
//                         onClick={() => handleFilePreviewRedirect(file.id)}
//                         className="flex items-center justify-center bg-teal-500 text-white p-2 rounded-full shadow hover:bg-teal-600 transition-transform transform hover:scale-105"
//                         title="Preview"
//                     >
//                         <HiTableCells className="w-5 h-5" />
//                     </button>

//                     {/* Insights Button */}
//                     <button
//                         onClick={() => handleInsightsRedirect(file.id, selectedAnalysisType)}
//                         className="flex items-center justify-center bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600 transition-transform transform hover:scale-105"
//                         title="Generate Insights"
//                     >
//                         <TbReportAnalytics className="w-5 h-5" />
//                     </button>

//                     {/* Delete Button */}
//                     <button
//                         onClick={() => deleteFile(file.id)}
//                         className="flex items-center justify-center bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition-transform transform hover:scale-105"
//                         title="Delete File"
//                     >
//                         <MdDelete className="w-5 h-5" />
//                     </button>
//                 </div>
//             </div>
//         ))}
//     </div>
// </div>

//                     </div>
//                 )}
//             </div>
//             <CTA_Upload />
//             <Footer />
//         </div>
//     );
    
// }    

// export default UploadFile;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../sections/Header';
import Footer from '../sections/Footer';
import axios from 'axios';
import './UploadFile.css';
import { MdDelete } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import CTA_Upload from './CTA_Upload';
import { TbReportAnalytics } from "react-icons/tb";
import { HiTableCells } from "react-icons/hi2";
import { IoLogOut } from "react-icons/io5";


function UploadFile() {
    const [filename, setFilename] = useState(null);
    const [files, setFiles] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');  // Add password state
    const [status, setStatus] = useState('');
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('tokens'));
    // const { isLoggedIn } = useContext(AuthContext);
    const [selectedAnalysisType, setSelectedAnalysisType] = useState('');
    const [user, setUser] = useState(null);
    const [tokens, setTokens] = useState(() => localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')) : null);

    const api = 'http://127.0.0.1:8000/api';
    const analysisOptions = ['Summary Statistics', 'Trend Analysis', 'Correlation Matrix']; // Sample analysis types

    const saveFile = () => {
        if (!filename) return;

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
                getFiles();
            })
            .catch((error) => {
                console.log('Error uploading file:', error);
                setStatus('Error Uploading File');
            });
    };

    const getFiles = () => {
        axios.get(api + '/files/')
            .then((response) => {
                setFiles(response.data);
            })
            .catch((error) => {
                console.log('Error fetching files:', error);
            });
    };

    const handleTableauRedirect = () => {
        navigate('/tableau-viz');
    };

    useEffect(() => {
        getFiles();
        document.body.classList.add('transition-opacity');
        setTimeout(() => {
            document.body.classList.remove('transition-opacity');
        }, 300);
        if (tokens) {
            setUser(user); // Set user based on tokens (in a real app, decode the token)
          } else {
            setUser(null);
          }
          setIsLoggedIn(!!tokens);
    }, [tokens]);

    const login = async () => {
        // try {
            // const response = await axios.post(api + '/login/', { username, password }); // Using state variables here
            // if (response.data && response.data.access) {
            //     setTokens(response.data);  // Set tokens state
            //     localStorage.setItem('tokens', JSON.stringify(response.data));  // Store tokens in localStorage
            //     setUser(username);  // Set user state
            //     setIsLoggedIn(true);  // Set logged-in status to true
                navigate('/Login');  // Redirect to home page or any other route
        //     } else {
        //         console.error('Login failed: Invalid response data.');
        //     }
        // } catch (error) {
        //     console.error('Login failed:', error.response ? error.response.data : error.message);
        // }
    };

    const signup = async () => {
        try {
            navigate('/signup')
            await axios.post(api + '/signup/', { username, password });
            await login(username, password);
        } catch (error) {
            console.error('Signup failed:', error);
        }
    };

    // const logout = async () => {
    //     try {
    //         await axios.post(api + '/logout/', { refresh: tokens.refresh });
    //         setTokens(null);
    //         setUser(null);
    //         localStorage.removeItem('tokens');
    //         setIsLoggedIn(false);
    //     } catch (error) {
    //         console.error('Logout failed:', error);
    //     }
    // };
    const deleteFile = (fileId) => {
        axios.delete(`${api}/files/${fileId}/`)
            .then(() => {
                setStatus('File Deleted Successfully');
                getFiles(); // Refresh file list after deletion
            })
            .catch((error) => {
                console.log('Error deleting file:', error);
                setStatus('Error Deleting File');
            });
    };
        const handleInsightsRedirect = (fileId, analysisType) => {
        navigate('/display-insights', {
            state: { fileId, analysisType }, // Pass fileId and selected analysis type
        });
    };
        const handleFilePreviewRedirect = (fileId) => {
        navigate(`/preview`, { state: { fileId } });
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
        .catch((error) => console.log('Error downloading file:', error));
    };
        const forceDownload = (response, title) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', title + '.csv');
        document.body.appendChild(link);
        link.click();
    };
    return (
        <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
            <Header />
            <div className="container mx-auto p-6 transition-opacity duration-300 ease-in-out bg-gray-900 text-gray-100">
                <div className="text-center mb-4">
                    {!isLoggedIn ? (
                        <>
                            {/* <input 
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                            />
                            <input 
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}  // Controlled input for password
                                className="input-field"
                            /> */}
                            <button
                                className="bg-teal-500 text-white px-4 py-2 rounded mx-2 hover:bg-teal-600"
                                onClick={login} // Call login
                            >
                                Login
                            </button>
                            <button
                                className="bg-orange-500 text-white px-4 py-2 rounded mx-2 hover:bg-orange-600"
                                onClick={signup} // Call signup
                            >
                                Signup
                            </button>
                        </>
                    ) : (
                       
                        navigate('/upload')
                    )}
                </div>

                {/* Remaining code for file upload, display, and analysis */}
            </div>
            {isLoggedIn && (
                    <div className="flex flex-col items-center space-y-6">
                        {/* Flex Container for CSV Upload and Analysis Select */}
                        <div className="flex justify-between w-full max-w-4xl space-x-4">
                            {/* CSV File Upload Section */}
                            <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-8">
                                <h4 className="text-2xl font-semibold mb-4">CSV File Upload</h4>
                                <form>
                                    <div className="mb-6">
                                        <label htmlFor="fileInput" className="block text-gray-300 mb-2 text-sm font-medium">
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
                                        className="bg-teal-500 text-white px-6 py-3 rounded-full w-full hover:bg-teal-600 transition-transform transform hover:scale-105"
                                    >
                                        Submit
                                    </button>
                                    {status && (
                                        <div className="bg-teal-100 text-teal-800 border border-teal-300 p-4 mt-4 rounded-lg">
                                            {status}
                                        </div>
                                    )}
                                </form>
                            </div>
    
                            {/* Analysis Type Section */}
                            <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-8">
                                <h4 className="text-2xl font-semibold mb-4">Select Analysis Type</h4>
                                <div className="mb-6">
                                    <label htmlFor="analysisSelect" className="block text-gray-300 mb-2 text-sm font-medium">
                                        Select Analysis Type
                                    </label>
                                    <select
                                        id="analysisSelect"
                                        value={selectedAnalysisType}
                                        onChange={(e) => setSelectedAnalysisType(e.target.value)}
                                        className="border border-gray-600 rounded-md p-3 w-full bg-gray-700 text-gray-300"
                                    >
                                        <option value="">Select Analysis</option>
                                        {analysisOptions.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
    
                        {/* Uploaded Datasets Section */}
                        <div className="w-full max-w-4xl bg-gray-800 shadow-lg rounded-lg p-8 mx-auto">
    <h4 className="text-2xl font-semibold mb-4 text-white text-center">Uploaded Datasets</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map((file, index) => (
            <div 
                key={index} 
                className="bg-gray-700 rounded-lg p-6 shadow-md flex flex-col justify-between space-y-4 transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
                {/* CSV title with wrapping */}
                <h5 className="text-lg font-bold text-gray-100 mb-4 break-words text-center">
                    {file.csv.split('/').pop()}
                </h5>

                {/* Buttons Container */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Download Button */}
                    <button
                        onClick={() => downloadWithAxios(file.csv, file.id)}
                        className="flex items-center justify-center bg-green-500 text-white p-2 rounded-full shadow hover:bg-green-600 transition-transform transform hover:scale-105"
                        title="Download CSV"
                    >
                        <FaDownload className="w-5 h-5" />
                    </button>

                    {/* Preview Button */}
                    <button
                        onClick={() => handleFilePreviewRedirect(file.id)}
                        className="flex items-center justify-center bg-teal-500 text-white p-2 rounded-full shadow hover:bg-teal-600 transition-transform transform hover:scale-105"
                        title="Preview"
                    >
                        <HiTableCells className="w-5 h-5" />
                    </button>

                    {/* Insights Button */}
                    <button
                        onClick={() => handleInsightsRedirect(file.id, selectedAnalysisType)}
                        className="flex items-center justify-center bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600 transition-transform transform hover:scale-105"
                        title="Generate Insights"
                    >
                        <TbReportAnalytics className="w-5 h-5" />
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => deleteFile(file.id)}
                        className="flex items-center justify-center bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition-transform transform hover:scale-105"
                        title="Delete File"
                    >
                        <MdDelete className="w-5 h-5" />
                    </button>
                </div>
            </div>
        ))}
    </div>
</div>

                    </div>
                )}
            {/* // </div> */}
            
            <CTA_Upload />
            <Footer />
        </div>
    );
}

export default UploadFile;
