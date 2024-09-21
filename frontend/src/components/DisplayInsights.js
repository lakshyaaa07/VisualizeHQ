import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DisplayInsights({ fileId }) {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/view_csv_preview/${fileId}/`);
                setInsights(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching insights:", error);
                setLoading(false);
            }
        };

        fetchInsights();
    }, [fileId]);

    if (loading) {
        return <div className="text-center text-gray-300 dark:text-gray-500">Loading insights...</div>;
    }

    if (!insights) {
        return <div className="text-center text-gray-300 dark:text-gray-500">No insights available</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">File Insights</h2>
            <div className="mb-4">
                <strong className="text-gray-800 dark:text-gray-300">Rows Removed:</strong> {insights.rows_removed}
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            {Object.keys(insights.data[0]).map((key) => (
                                <th
                                    key={key}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                                >
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {insights.data.map((row, idx) => (
                            <tr key={idx}>
                                {Object.values(row).map((val, i) => (
                                    <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {val}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DisplayInsights;
