import React, { useState } from 'react';

const CodeBlock = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset copied status after 2 seconds
        });
    };

    return (
        <div className="relative bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mt-4">
            <pre className="overflow-x-auto">
                <code className="text-sm text-gray-700 dark:text-gray-300">{code}</code>
            </pre>
            <button 
                onClick={copyToClipboard}
                className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-transform transform hover:scale-105"
            >
                {copied ? 'Copied!' : 'Copy Code'}
            </button>
        </div>
    );
};

export default CodeBlock;
