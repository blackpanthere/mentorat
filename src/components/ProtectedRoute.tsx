import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = sessionStorage.getItem('organizer_auth') === 'true';

        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [navigate]);

    const isAuthenticated = sessionStorage.getItem('organizer_auth') === 'true';

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
