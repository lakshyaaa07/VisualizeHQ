import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function DisplayInsights() {
    const location = useLocation();
    const { fileId } = location.state || {}; // Accessing fileId from location.state
    const [insights, setInsights] = useState(null);
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        const fetchInsights = async () => {
            if (!fileId) return; // Early return if fileId is not defined
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/files/${fileId}/insights/`);
                setInsights(response.data.insights); // Adjusted to get insights from response
                // Call get_predictions after insights are fetched
                await get_predictions();
            } catch (error) {
                console.error("Error fetching insights:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [fileId]);

    // Function to get predictions based on the fileId
    const get_predictions = async () => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/files/${fileId}/predictions/`, {
                // You can pass additional data here if needed
            });
            setPredictions(response.data.predictions); // Adjust based on your API response structure
        } catch (error) {
            console.error("Error fetching predictions:", error);
        }
    };

    if (loading) {
        return <div className="text-center text-gray-300 dark:text-gray-500">Loading insights...</div>;
    }

    if (!insights) {
        return <div className="text-center text-gray-300 dark:text-gray-500">No insights available</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">File Insights</h2>
            {/* Display each insight statistic */}
            {Object.keys(insights).map((key) => (
                <div key={key} className="mb-4">
                    <strong className="text-gray-800 dark:text-gray-300">{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                    <pre className="text-gray-700 dark:text-gray-400">{JSON.stringify(insights[key], null, 2)}</pre>
                </div>
            ))}
            {/* Display predictions if available */}
            {predictions && (
                <div className="mt-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Predictions</h3>
                    <pre className="text-gray-700 dark:text-gray-400">{JSON.stringify(predictions, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default DisplayInsights;
