// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // Verifica si el usuario está autenticado
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children; // Si está autenticado, muestra el contenido protegido
};

export default PrivateRoute;
