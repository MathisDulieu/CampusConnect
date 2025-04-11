import React, {useState} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {useGetMe} from '../../hooks/user/userQueries';
import {Role} from '../../hooks/type.ts';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {data} = useGetMe();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-blue-600 text-xl font-bold">Campus Connect</span>
                        </div>

                        <nav className="hidden md:ml-6 md:flex md:space-x-4">
                            {data?.me && (
                                <>
                                    <Link
                                        to="/home"
                                        className={`${
                                            isActive('/home') || isActive('/student-dashboard') || isActive('/professor-dashboard')
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        } px-3 py-2 rounded-md text-sm font-medium inline-flex items-center`}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className={`${
                                            isActive('/profile')
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        } px-3 py-2 rounded-md text-sm font-medium inline-flex items-center`}
                                    >
                                        Profile
                                    </Link>
                                    {data.me.role === Role.PROFESSOR && (
                                        <Link
                                            to="/professor-dashboard"
                                            className={`${
                                                isActive('/professor-dashboard')
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            } px-3 py-2 rounded-md text-sm font-medium inline-flex items-center`}
                                        >
                                            Classes
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center">
                        {data?.me ? (
                            <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                              {data.me.username} ({data.me.role})
                            </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1.5 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    to="/login"
                                    className={`${
                                        isActive('/login')
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    } px-3 py-2 rounded-md text-sm font-medium`}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className={`${
                                        isActive('/register')
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    } px-3 py-2 rounded-md text-sm font-medium`}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            ) : (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {data?.me ? (
                            <>
                                <Link
                                    to="/home"
                                    className={`${
                                        isActive('/home') || isActive('/student-dashboard') || isActive('/professor-dashboard')
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    } block px-3 py-2 rounded-md text-base font-medium`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/profile"
                                    className={`${
                                        isActive('/profile')
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    } block px-3 py-2 rounded-md text-base font-medium`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                {data.me.role === Role.PROFESSOR && (
                                    <Link
                                        to="/professor-dashboard"
                                        className={`${
                                            isActive('/professor-dashboard')
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        } block px-3 py-2 rounded-md text-base font-medium`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Classes
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="text-gray-700 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`${
                                        isActive('/login')
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    } block px-3 py-2 rounded-md text-base font-medium`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className={`${
                                        isActive('/register')
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    } block px-3 py-2 rounded-md text-base font-medium`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;