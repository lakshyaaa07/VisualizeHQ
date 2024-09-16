import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('tokens');
        navigate('/login');  // Redirect to login page
    };

    return (
        <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={handleLogout}
        >
            Logout
        </button>
    );
};

export default Logout;  