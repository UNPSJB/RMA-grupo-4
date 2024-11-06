import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        return storedAuth === 'true';
    });
    
    const [user, setUser] = useState(() => {
        return localStorage.getItem('user');
    });

    const [userRole, setUserRole] = useState(() => {
        return localStorage.getItem('userRole');
    });

    const [token, setToken] = useState(() => {
        // Recupera el token desde localStorage
        return localStorage.getItem('token');
    });

    useEffect(() => {
        localStorage.setItem('isAuthenticated', isAuthenticated);
        if (user) {
            localStorage.setItem('user', user);
        } else {
            localStorage.removeItem('user');
        }
        if (userRole) {
            localStorage.setItem('userRole', userRole);
        } else {
            localStorage.removeItem('userRole');
        }
        if (token) {
             localStorage.setItem('token', token);
        } else {
             localStorage.removeItem('token');
         }
    }, [isAuthenticated, user, userRole, token]);

    const login = (username, role, authToken) => {
        setIsAuthenticated(true);
        setUser(username);
        setUserRole(role);
        setToken(authToken); // Guarda el token
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
        setToken(null); // Limpia el token
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('token'); // Elimina el token de localStorage
        localStorage.removeItem(`token_${user}`); // NO TOCAR
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, userRole, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export default AuthContext;
