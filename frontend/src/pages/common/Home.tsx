import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMe } from '../../hooks/user/userQueries';
import { Role } from '../../hooks/type.ts';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { data, loading, error } = useGetMe();

    useEffect(() => {
        if (!localStorage.getItem('authToken')) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (data?.me) {
            if (data.me.role === Role.STUDENT) {
                navigate('/student-dashboard');
            } else if (data.me.role === Role.PROFESSOR || data.me.role === Role.ADMIN) {
                navigate('/professor-dashboard');
            }
        }
    }, [data, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Error: {error.message}
                </div>
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={() => {
                        localStorage.removeItem('authToken');
                        navigate('/login');
                    }}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-xl">Redirecting to dashboard...</div>
        </div>
    );
};

export default Home;