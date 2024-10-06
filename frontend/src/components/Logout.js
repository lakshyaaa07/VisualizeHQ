import { useNavigate } from 'react-router-dom';
const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('tokens');
        navigate('/');  // Redirect to login page
    };
    const handleCancel=()=>{
        navigate('/upload')
    }

    return (
        // <button
        //     className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        //     onClick={handleLogout}
        // >
        //     Logout
        // </button>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
    <h2 className="text-gray-800 text-lg font-semibold mb-4">Are you sure you want to log out?</h2>
    <p className="text-gray-600 mb-6">You will need to log in again to access your account.</p>
    <div className="flex justify-between">
        <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={handleCancel}
        >
            Cancel
        </button>
        <button
            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-2 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-50"
            onClick={handleLogout}
        >
            Logout
        </button>
    </div>
</div>

    );
};

export default Logout;