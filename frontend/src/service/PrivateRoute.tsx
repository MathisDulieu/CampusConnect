import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Role } from '../hooks/type.ts';

interface PrivateRouteProps {
    requiredRole?: 'student' | 'professor' | 'admin';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRole }) => {
    const { isAuthenticated, isLoading, userRole } = useAuth();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole) {
        let roleEnum: Role;
        switch (requiredRole) {
            case 'student':
                roleEnum = Role.STUDENT;
                break;
            case 'professor':
                roleEnum = Role.PROFESSOR;
                break;
            case 'admin':
                roleEnum = Role.ADMIN;
                break;
            default:
                roleEnum = Role.STUDENT;
        }

        if (userRole !== roleEnum && userRole !== Role.ADMIN) {
            return <Navigate to={userRole === Role.STUDENT ? '/student-dashboard' : '/professor-dashboard'} replace />;
        }
    }

    return <Outlet />;
};

export default PrivateRoute;