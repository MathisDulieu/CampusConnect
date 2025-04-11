import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '../../hooks/auth/authMutations';
import { Role } from '../../hooks/type.ts';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, UserIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const primaryBlue = "#3498db";
const secondaryBlue = "#2980b9";

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: Role.STUDENT
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const [register, { loading }] = useRegister();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = "L'adresse e-mail est requise";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Format d'e-mail invalide";
        }

        if (!formData.username) {
            newErrors.username = "Le nom d'utilisateur est requis";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError('');

        if (!validateForm()) {
            return;
        }

        try {
            const { data } = await register({
                variables: {
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                    role: formData.role
                }
            });

            if (data?.register) {
                navigate('/login', {
                    state: { message: "Inscription réussie ! Vous pouvez maintenant vous connecter." }
                });
            } else {
                setGeneralError("L'inscription a échoué");
            }
        } catch (err: any) {
            if (err.message.includes("email")) {
                setErrors(prev => ({ ...prev, email: "Cet e-mail est déjà utilisé" }));
            } else if (err.message.includes("username")) {
                setErrors(prev => ({ ...prev, username: "Ce nom d'utilisateur est déjà pris" }));
            } else {
                setGeneralError(err.message || "Une erreur s'est produite lors de l'inscription");
            }
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-2/5 h-2/5 rounded-full bg-blue-100 opacity-30"></div>
            <div className="absolute bottom-[-5%] right-[-5%] w-1/3 h-1/3 rounded-full bg-blue-200 opacity-20"></div>
            <div className="absolute top-[-50px] right-[-80px] w-[150px] h-[150px] bg-gradient-to-br from-blue-100 to-blue-100 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] rotate-12 hidden md:block z-0"></div>

            <div className="container mx-auto px-4 z-10">
                <div className="flex flex-col items-center mt-8 md:mt-12 lg:mt-16 mb-8 md:mb-12 lg:mb-16 relative">
                    <h1 className="text-4xl font-bold text-blue-500 mb-6 text-center drop-shadow-sm"
                        style={{ color: primaryBlue }}>
                        Campus Connect
                    </h1>

                    <div className="w-full max-w-md relative">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-blue-600"
                                 style={{ background: `linear-gradient(90deg, ${primaryBlue}, ${secondaryBlue})` }}></div>

                            <h2 className="text-2xl font-semibold text-center mb-3 text-gray-800">Créer un compte</h2>
                            <p className="text-center text-gray-500 mb-6">Inscrivez-vous pour accéder à la plateforme</p>

                            {generalError && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                    {generalError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2" htmlFor="username">
                                        Nom complet
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <UserIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            className={`w-full pl-10 pr-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Votre nom"
                                            required
                                        />
                                    </div>
                                    {errors.username && (
                                        <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                                    )}
                                </div>

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
                                            name="email"
                                            type="email"
                                            className={`w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="votre@email.com"
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2" htmlFor="role">
                                        Rôle
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select
                                            id="role"
                                            name="role"
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                            value={formData.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value={Role.STUDENT}>Étudiant</option>
                                            <option value={Role.PROFESSOR}>Professeur</option>
                                        </select>
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
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            className={`w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                                            value={formData.password}
                                            onChange={handleChange}
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
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                                        Confirmer le mot de passe
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            className={`w-full pl-10 pr-10 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeSlashIcon className="h-5 w-5" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 rounded-lg font-medium text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-70"
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
                                            Inscription en cours...
                                        </div>
                                    ) : "S'inscrire"}
                                </button>

                                <div className="relative flex items-center justify-center mt-6 mb-4">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="flex-shrink mx-4 text-gray-500 text-sm">ou</span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        Vous avez déjà un compte?{' '}
                                        <Link to="/login" className="font-semibold text-blue-500 hover:underline">
                                            Se connecter
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

export default Register;