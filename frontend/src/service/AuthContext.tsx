import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGetMe } from '../hooks/user/userQueries';
import { Role, User } from '../hooks/type.ts';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    userRole: Role | null;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const { data, loading, error: userError, refetch } = useGetMe();

    useEffect(() => {
        if (!loading) {
            if (data?.me) {
                setUser(data.me);
            }

            if (userError) {
                setError(userError);
                if (userError.message.includes('Authentication') || userError.message.includes('Unauthorized')) {
                    localStorage.removeItem('authToken');
                }
            }

            setIsLoading(false);
        }
    }, [data, loading, userError]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setIsLoading(false);
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('authToken', token);
        refetch();
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    const value = {
        user,
        isLoading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
        userRole: user?.role || null,
        updateUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};