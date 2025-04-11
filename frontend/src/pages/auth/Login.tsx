import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLogin } from '../../hooks/auth/authMutations';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const primaryBlue = "#3498db";
const secondaryBlue = "#2980b9";

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.message || "";

    const [login, { loading }] = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Email est requis');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Email invalide');
            return;
        }

        if (!password || password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        try {
            const { data } = await login({
                variables: { email, password }
            });

            if (data?.login) {
                localStorage.setItem('authToken', data.login);

                navigate('/home');
            } else {
                setError('Échec de la connexion. Vérifiez vos identifiants.');
            }
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue pendant la connexion');
        }
    };

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-2/5 h-2/5 rounded-full bg-blue-100 opacity-30"></div>
            <div className="absolute bottom-[-5%] right-[-5%] w-1/3 h-1/3 rounded-full bg-blue-200 opacity-20"></div>
            <div className="absolute top-[-50px] right-[-80px] w-[150px] h-[150px] bg-gradient-to-br from-blue-100 to-blue-100 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] rotate-12 hidden md:block z-0"></div>

            <div className="container mx-auto px-4 z-10">
                <div className="flex flex-col items-center mt-8 md:mt-16 lg:mt-24 mb-12 md:mb-16 lg:mb-24 relative">
                    <h1 className="text-4xl font-bold text-blue-500 mb-8 text-center drop-shadow-sm"
                        style={{ color: primaryBlue }}>
                        Campus Connect
                    </h1>

                    <div className="w-full max-w-md relative">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-blue-600"
                                 style={{ background: `linear-gradient(90deg, ${primaryBlue}, ${secondaryBlue})` }}></div>

                            <h2 className="text-2xl font-semibold text-center mb-3 text-gray-800">Bienvenue</h2>
                            <p className="text-center text-gray-500 mb-6">Connectez-vous pour accéder à votre espace</p>

                            {successMessage && (
                                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
                                    {successMessage}
                                </div>
                            )}

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2" htmlFor="email">
                                        Adresse e-mail
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="votre@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2" htmlFor="password">
                                        Mot de passe
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                            >
                                                {showPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                            Se souvenir de moi
                                        </label>
                                    </div>
                                    <a href="#" className="text-sm text-blue-500 hover:underline">Mot de passe oublié?</a>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 rounded-lg font-medium text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                                    style={{
                                        background: `linear-gradient(90deg, ${primaryBlue}, ${secondaryBlue})`,
                                        boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex justify-center items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Connexion en cours...
                                        </div>
                                    ) : "Se connecter"}
                                </button>

                                <div className="relative flex items-center justify-center mt-6 mb-6">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="flex-shrink mx-4 text-gray-500 text-sm">ou</span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        Vous n'avez pas de compte?{' '}
                                        <Link to="/register" className="font-semibold text-blue-500 hover:underline">
                                            S'inscrire
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;