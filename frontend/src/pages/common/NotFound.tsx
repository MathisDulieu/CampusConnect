import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
                <p className="mb-8 text-gray-500">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/home"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg inline-block transition duration-200"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;