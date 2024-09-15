

import React, { useEffect, useState } from 'react';
import { useLocation , useNavigate } from 'react-router-dom';
import axios from 'axios';

const DisplayCSVData = () => {
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

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

    const back = ()=>{
        navigate("/")
    }

    // const handleVisualise = () =>{
    //     navigate(`/visualise` )
    // }
    const handleVisualise = () => {
        navigate(`/visualise`, { state: { fileId } }); // Pass the fileId
      };



    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>CSV Preview</h2>
            {previewData && (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                {Object.keys(previewData.data[0] || {}).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {previewData.data.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, idx) => (
                                        <td key={idx}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="alert alert-warning mt-3">
                        Rows removed: {previewData.rows_removed}
                    </div>
                </div>
            )}
<center>
            <table cellPadding={10} >

<tr>
            <td><button type="button" class="btn btn-info" onClick={back} >Home</button> </td>

            <td><button type='button' class="btn btn-success" onClick={handleVisualise}>Visualize</button></td>
            </tr>

            </table>
            </center>
        </div>
    );
};

export default DisplayCSVData;