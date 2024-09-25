// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import CodeBlock from './CodeBlock'; // Assuming CodeBlock is a component that handles code rendering

// function DisplayInsights() {
//     const location = useLocation();
//     const { fileId } = location.state || {}; // Accessing fileId from location.state
//     const [insights, setInsights] = useState(null);
//     const [aiInsights, setAIInsights] = useState(null); // New state for AI insights
//     const [predictions, setPredictions] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchInsights = async () => {
//             if (!fileId) return; // Early return if fileId is not defined
//             try {
//                 const response = await axios.get(`http://127.0.0.1:8000/api/files/${fileId}/insights/`);
//                 setInsights(response.data.insights); // Adjusted to get insights from response
//                 setAIInsights(response.data.ai_insights); // Store AI insights
//                 // Call get_predictions after insights are fetched
//                 await get_predictions();
//             } catch (error) {
//                 console.error("Error fetching insights:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInsights();
//     }, [fileId]);

//     // Function to get predictions based on the fileId
//     const get_predictions = async () => {
//         try {
//             const response = await axios.post(`http://127.0.0.1:8000/api/files/${fileId}/predictions/`, {
//                 // You can pass additional data here if needed
//             });
//             setPredictions(response.data.predictions); // Adjust based on your API response structure
//         } catch (error) {
//             console.error("Error fetching predictions:", error);
//         }
//     };

//     if (loading) {
//         return <div className="text-center text-gray-300 dark:text-gray-500">Loading insights...</div>;
//     }

//     if (!insights) {
//         return <div className="text-center text-gray-300 dark:text-gray-500">No insights available</div>;
//     }

//     return (
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">File Insights</h2>
//             {/* Display each insight statistic */}
//             {Object.keys(insights).map((key) => (
//                 <div key={key} className="mb-4">
//                     <strong className="text-gray-800 dark:text-gray-300">{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
//                     <pre className="text-gray-700 dark:text-gray-400">{JSON.stringify(insights[key], null, 2)}</pre>
//                 </div>
//             ))}

//             {/* New div with black background and white text for AI insights */}
//             <div className="bg-black text-white rounded-lg p-6 mt-6">
//                 <h3 className="text-xl font-bold">AI Insights</h3>
//                 {aiInsights ? (
//                     <ReactMarkdown 
//                         children={aiInsights} 
//                         components={{
//                             code({node, inline, className, children, ...props}) {
//                                 return (
//                                     <CodeBlock code={String(children).replace(/\n$/, '')} {...props} />
//                                 )
//                             }
//                         }}
//                         remarkPlugins={[remarkGfm]} // Support GitHub-flavored markdown
//                     />
//                 ) : (
//                     <p>No AI insights available</p>
//                 )}
//             </div>

//             {/* Display predictions if available */}
//             {predictions && (
//                 <div className="mt-4">
//                     <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Predictions</h3>
//                     <pre className="text-gray-700 dark:text-gray-400">{JSON.stringify(predictions, null, 2)}</pre>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default DisplayInsights;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock'; // Assuming CodeBlock is a component that handles code rendering

function DisplayInsights() {
    const location = useLocation();
    const { fileId } = location.state || {}; // Accessing fileId from location.state
    const [insights, setInsights] = useState(null);
    const [aiInsights, setAIInsights] = useState(null); // New state for AI insights
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            if (!fileId) return; // Early return if fileId is not defined
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/files/${fileId}/insights/`);
                setInsights(response.data.insights); // Adjusted to get insights from response
                setAIInsights(response.data.ai_insights); // Store AI insights
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

    // Convert insights object into a table format
    const renderTable = () => (
        <div className="overflow-x-auto">
            <table className="table-auto w-full text-left text-gray-900 dark:text-gray-100 bg-gray-800 rounded-lg shadow-md mx-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Feature</th>
                        <th className="px-4 py-2">Mean</th>
                        <th className="px-4 py-2">Median</th>
                        <th className="px-4 py-2">Variance</th>
                        <th className="px-4 py-2">Standard Deviation</th>
                        <th className="px-4 py-2">Max</th>
                        <th className="px-4 py-2">Min</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(insights).map((key) => (
                        <tr key={key} className="border-t dark:border-gray-700">
                            <td className="px-4 py-2 font-bold">{key}</td>
                            <td className="px-4 py-2">{insights[key].mean.toFixed(2)}</td>
                            <td className="px-4 py-2">{insights[key].median.toFixed(2)}</td>
                            <td className="px-4 py-2">{insights[key].variance.toFixed(2)}</td>
                            <td className="px-4 py-2">{insights[key].std_dev.toFixed(2)}</td>
                            <td className="px-4 py-2">{insights[key].max}</td>
                            <td className="px-4 py-2">{insights[key].min}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 py-8">
            <h2 className="text-3xl font-bold text-white mb-8">CSV Preview</h2>
            {/* Render insights as a table */}
            {renderTable()}

            {/* New div with black background and white text for AI insights */}
            <div className="bg-black text-white rounded-lg p-6 mt-6 w-full md:w-3/4 lg:w-1/2">
                <h3 className="text-xl font-bold">AI Insights</h3>
                {aiInsights ? (
                    <ReactMarkdown 
                        children={aiInsights} 
                        components={{
                            code({node, inline, className, children, ...props}) {
                                return (
                                    <CodeBlock code={String(children).replace(/\n$/, '')} {...props} />
                                )
                            }
                        }}
                        remarkPlugins={[remarkGfm]} // Support GitHub-flavored markdown
                    />
                ) : (
                    <p>No AI insights available</p>
                )}
            </div>

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
