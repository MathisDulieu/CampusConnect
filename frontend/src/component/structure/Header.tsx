import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGetMe } from '../../hooks/user/userQueries';
import { Role } from '../../hooks/type.ts';
import {
    Bars3Icon,
    XMarkIcon,
    UserIcon,
    ArrowRightOnRectangleIcon,
    HomeIcon,
    UserCircleIcon,
    AcademicCapIcon,
} from '@heroicons/react/24/outline';

const primaryBlue = "#3498db";
const secondaryBlue = "#2980b9";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data } = useGetMe();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
        window.location.reload();
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .join('')
            .substring(0, 2);
    };

    const getAvatarColor = (name: string) => {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
            'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
        ];

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <>
            <header className="sticky top-0 z-50">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 shadow-md"
                     style={{ background: `linear-gradient(135deg, ${secondaryBlue} 0%, ${primaryBlue} 100%)` }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
                                >
                                    <span className="sr-only">Ouvrir le menu</span>
                                    <Bars3Icon className="h-6 w-6" />
                                </button>
                                <div className="flex-shrink-0 flex items-center ml-2 sm:ml-4">
                                    <AcademicCapIcon className="h-8 w-8 text-white hidden sm:block mr-2" />
                                    <Link
                                        to="/home"
                                        className="text-white text-xl font-bold hover:text-white/90 transition duration-200"
                                    >
                                        CampusConnect
                                    </Link>
                                </div>
                            </div>

                            <div className="hidden md:flex items-center space-x-2">
                                {data?.me ? (
                                    <>
                                        {data.me.role === Role.STUDENT && (
                                            <>
                                                <Link
                                                    to="/student-dashboard"
                                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-white ${
                                                        isActive('/student-dashboard')
                                                            ? 'bg-white/20'
                                                            : 'hover:bg-white/10'
                                                    } transition duration-200`}
                                                >
                                                    <HomeIcon className="h-5 w-5 mr-1.5" />
                                                    Tableau de bord
                                                </Link>
                                            </>
                                        )}
                                        {data.me.role === Role.PROFESSOR && (
                                            <>
                                                <Link
                                                    to="/professor-dashboard"
                                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-white ${
                                                        isActive('/professor-dashboard')
                                                            ? 'bg-white/20'
                                                            : 'hover:bg-white/10'
                                                    } transition duration-200`}
                                                >
                                                    <HomeIcon className="h-5 w-5 mr-1.5" />
                                                    Tableau de bord
                                                </Link>
                                            </>
                                        )}

                                        <Link
                                            to="/profile"
                                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-white ${
                                                isActive('/profile')
                                                    ? 'bg-white/20'
                                                    : 'hover:bg-white/10'
                                            } transition duration-200`}
                                        >
                                            <UserCircleIcon className="h-5 w-5 mr-1.5" />
                                            Profil
                                        </Link>

                                        <div className="relative ml-3">
                                            <div>
                                                <button
                                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 p-1 hover:bg-white/20 transition duration-200"
                                                >
                                                    <span className="sr-only">Ouvrir le menu utilisateur</span>
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold ${getAvatarColor(data.me.username)}`}>
                                                        {getInitials(data.me.username)}
                                                    </div>
                                                </button>
                                            </div>

                                            {isProfileMenuOpen && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                                                        <p className="font-medium">{data.me.username}</p>
                                                        <p className="text-gray-500">{data.me.role}</p>
                                                    </div>
                                                    <Link
                                                        to="/profile"
                                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                    >
                                                        <UserCircleIcon className="inline h-5 w-5 mr-2 text-gray-500" />
                                                        <span>Profil</span>
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                    >
                                                        <ArrowRightOnRectangleIcon className="inline h-5 w-5 mr-2 text-gray-500" />
                                                        <span>Déconnexion</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium text-white ${
                                                isActive('/login')
                                                    ? 'bg-white/20'
                                                    : 'hover:bg-white/10'
                                            } transition duration-200`}
                                        >
                                            Connexion
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="flex items-center px-4 py-2 rounded-md text-sm font-medium border border-white/70 text-white hover:bg-white/10 transition duration-200"
                                        >
                                            Inscription
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="absolute inset-0 z-40" style={{ height: '100vh' }}>
                        <div
                            className="fixed inset-0 bg-black bg-opacity-30"
                            onClick={() => setIsMenuOpen(false)}
                        ></div>

                        <div className="absolute top-0 left-0 flex flex-col w-64 max-w-xs h-screen bg-white shadow-xl z-50">
                            <div className="pt-5 pb-4 flex-1 overflow-y-auto">
                                <div className="relative h-1">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-500"
                                         style={{ background: `linear-gradient(90deg, ${primaryBlue}, ${secondaryBlue})` }}></div>
                                </div>

                                <div className="flex items-center justify-between px-4 py-4">
                                    <div className="flex items-center">
                                        <AcademicCapIcon className="h-8 w-8 text-blue-500 mr-2" />
                                        <div className="text-xl font-bold text-blue-500">CampusConnect</div>
                                    </div>
                                    <button
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                <div className="mt-2 border-t border-gray-200 pt-4">
                                    {data?.me ? (
                                        <div className="px-4 py-2 mb-2">
                                            <div className="flex items-center">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold ${getAvatarColor(data.me.username)}`}>
                                                    {getInitials(data.me.username)}
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-base font-medium text-gray-800">{data.me.username}</p>
                                                    <p className="text-sm text-gray-500">{data.me.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    <nav className="px-2 space-y-1">
                                        {data?.me ? (
                                            <>
                                                <Link
                                                    to="/home"
                                                    className={`flex items-center px-3 py-2.5 text-base font-medium rounded-md ${
                                                        isActive('/home')
                                                            ? 'bg-blue-50 text-blue-600'
                                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <HomeIcon className="mr-3 h-6 w-6 text-gray-500" />
                                                    Accueil
                                                </Link>

                                                {data.me.role === Role.STUDENT && (
                                                    <Link
                                                        to="/student-dashboard"
                                                        className={`flex items-center px-3 py-2.5 text-base font-medium rounded-md ${
                                                            isActive('/student-dashboard')
                                                                ? 'bg-blue-50 text-blue-600'
                                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                        }`}
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        <HomeIcon className="mr-3 h-6 w-6 text-gray-500" />
                                                        Tableau de bord
                                                    </Link>
                                                )}

                                                {data.me.role === Role.PROFESSOR && (
                                                    <Link
                                                        to="/professor-dashboard"
                                                        className={`flex items-center px-3 py-2.5 text-base font-medium rounded-md ${
                                                            isActive('/professor-dashboard')
                                                                ? 'bg-blue-50 text-blue-600'
                                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                        }`}
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        <HomeIcon className="mr-3 h-6 w-6 text-gray-500" />
                                                        Tableau de bord
                                                    </Link>
                                                )}

                                                <div className="border-t border-gray-200 my-4"></div>

                                                <Link
                                                    to="/profile"
                                                    className={`flex items-center px-3 py-2.5 text-base font-medium rounded-md ${
                                                        isActive('/profile')
                                                            ? 'bg-blue-50 text-blue-600'
                                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <UserIcon className="mr-3 h-6 w-6 text-gray-500" />
                                                    Profil
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center w-full px-3 py-2.5 text-base font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                                >
                                                    <ArrowRightOnRectangleIcon className="mr-3 h-6 w-6 text-gray-500" />
                                                    Déconnexion
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    to="/home"
                                                    className={`flex items-center px-3 py-2.5 text-base font-medium rounded-md ${
                                                        isActive('/home')
                                                            ? 'bg-blue-50 text-blue-600'
                                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <HomeIcon className="mr-3 h-6 w-6 text-gray-500" />
                                                    Accueil
                                                </Link>
                                                <Link
                                                    to="/login"
                                                    className={`flex items-center px-3 py-2.5 text-base font-medium rounded-md ${
                                                        isActive('/login')
                                                            ? 'bg-blue-50 text-blue-600'
                                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <UserIcon className="mr-3 h-6 w-6 text-gray-500" />
                                                    Connexion
                                                </Link>
                                                <Link
                                                    to="/register"
                                                    className={`flex items-center px-3 py-2.5 text-base font-medium rounded-md ${
                                                        isActive('/register')
                                                            ? 'bg-blue-50 text-blue-600'
                                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <UserCircleIcon className="mr-3 h-6 w-6 text-gray-500" />
                                                    Inscription
                                                </Link>
                                            </>
                                        )}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {isProfileMenuOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Header;