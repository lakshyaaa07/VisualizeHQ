// FileUpload.js

import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (files.length === 0) {
            setError("Please select a file to upload.");
            return;
        }
        
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        setLoading(true);
        setError(null); // Reset error before new upload attempt

        try {
            const csrfToken = Cookies.get('csrftoken'); // Retrieve the CSRF token
            console.log(csrfToken)
            const response = await axios.post('/csv/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrfToken
                }
            });

            // Handle successful upload
            console.log('Upload successful:', response.data);
        } catch (err) {
            if (err.response) {
                // Server responded with a status other than 2xx
                setError(`Upload failed: ${err.response.data}`);
            } else if (err.request) {
                // Request was made but no response received
                setError("No response received from the server.");
            } else {
                // Something happened in setting up the request
                setError(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={loading}
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default FileUpload;
