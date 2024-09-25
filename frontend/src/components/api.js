import axios from 'axios';

const api = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
    baseURL: api,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to upload a file
export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('csv', file);
    return apiClient.post('/files/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Function to get all files
export const getFiles = () => {
    return apiClient.get('/files/');
};

// Function to download a file
export const downloadFile = (fileId) => {
    return apiClient.get(`/files/${fileId}/`, { responseType: 'arraybuffer' });
};

// Function to delete a file
export const deleteFile = (fileId) => {
    return apiClient.delete(`/files/${fileId}/`);
};

// Function to get insights for a specific file
export const getInsights = (fileId) => {
    return apiClient.get(`/files/${fileId}/insights/`);
};

// Function to get predictions for a specific file
export const getPredictions = (fileId) => {
    return apiClient.get(`/files/${fileId}/predictions/`);
};

// Function to get CSV data
export const getCsvData = (fileId) => {
    return apiClient.get(`/files/${fileId}/`);
};

// Function to view CSV preview
export const viewCsvPreview = (fileId) => {
    return apiClient.get(`/view_csv_preview/${fileId}/`);
};

export default apiClient;
