import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UploadFile.css';

function UploadFile() {
    const [filename, setFilename] = useState('');
    const [files, setFiles] = useState([{}]);
    const [status, setStatus] = useState('');

    let api = 'http://127.0.0.1:8000/api';

    const saveFile = () => {
        console.log('Button clicked');

        let formData = new FormData();
        formData.append('csv', filename);

        let axiosConfig = {
            headers: {
                'Content-Type': 'multpart/form-data',
            },
        };

        console.log(formData);
        axios
            .post(api + '/files/', formData, axiosConfig)
            .then((response) => {
                console.log(response);
                setStatus('File Uploaded Successfully');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getFiles = () => {
        axios
            .get(api + '/files/')
            .then((response) => {
                setFiles(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const forceDownload = (response, title) => {
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', title + '.csv');
        document.body.appendChild(link);
        link.click();
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

    useEffect(() => {
        getFiles();
        console.log(files);
    }, []);

    const toggleTheme = () => {
        document.body.classList.toggle('dark-mode');
        const themeIcon = document.getElementById('themeIcon');
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
            themeIcon.parentElement.innerHTML = `<span id="themeIcon" class="bi bi-sun-fill"></span> Light Mode`;
        } else {
            themeIcon.classList.replace('bi-sun-fill', 'bi-moon-fill');
            themeIcon.parentElement.innerHTML = `<span id="themeIcon" class="bi bi-moon-fill"></span> Dark Mode`;
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="text-center mb-4">
                <h2 className="title">VISTAS x VISUALIZE</h2>
                <button className="btn btn-outline-secondary" id="themeToggle" onClick={toggleTheme}>
                    <span id="themeIcon" className="bi bi-moon-fill"></span> Dark Mode
                </button>
            </div>
            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4 className="card-title">CSV File Upload</h4>
                            <form>
                                <div className="form-group mb-3">
                                    <label htmlFor="exampleFormControlFile1" className="form-label">
                                        Browse CSV File
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => setFilename(e.target.files[0])}
                                        className="form-control"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={saveFile}
                                    className="btn btn-primary w-100"
                                >
                                    Submit
                                </button>
                                {status && <div className="alert alert-info mt-3">{status}</div>}
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4 className="card-title">Uploaded Datasets</h4>
                            <table className="table table-hover mt-4">
                                <thead>
                                    <tr>
                                        <th scope="col">Dataset Title</th>
                                        <th scope="col">Download</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.map((file) => (
                                        <tr key={file.id}>
                                            <td className="dataset-title">{file.csv}</td>
                                            <td>
                                                <button
                                                    onClick={() => downloadWithAxios(file.csv, file.id)}
                                                    className="btn btn-success btn-sm"
                                                >
                                                    Download
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
    );
}

export default UploadFile;
