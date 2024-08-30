// src/components/DisplayCSVData.js
import React, { useEffect, useState } from 'react';

const DisplayCSVData = ({ fileId }) => {
    const [csvData, setCsvData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`/api/files/${fileId}/`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                setCsvData(data.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [fileId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>CSV Data</h2>
            <table>
                <thead>
                    <tr>
                        {csvData.length > 0 &&
                            Object.keys(csvData[0]).map((key) => <th key={key}>{key}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {csvData.map((row, index) => (
                        <tr key={index}>
                            {Object.values(row).map((value, i) => (
                                <td key={i}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DisplayCSVData;
