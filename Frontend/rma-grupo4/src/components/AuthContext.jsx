import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    // Recupera el estado de autenticación desde localStorage al cargar la aplicación
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        return storedAuth === 'true'; // Convierte el string a booleano
    });
    
    const [user, setUser] = useState(() => {
        return localStorage.getItem('user'); // Recupera el nombre de usuario almacenado
    });

    const [userRole, setUserRole] = useState(() => {
        return localStorage.getItem('userRole'); // Recupera el rol almacenado
    });
    
    // Efecto para actualizar localStorage cada vez que cambie isAuthenticated, user o userRole
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
    }, [isAuthenticated, user, userRole]);

    const login = (username, role) => {
        setIsAuthenticated(true);
        setUser(username);
        setUserRole(role); // Guarda el rol del usuario
        localStorage.setItem('token', 'your_token_value'); // Guarda el token si es necesario
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null); // Limpia el rol del usuario
        localStorage.removeItem('user');
        localStorage.removeItem('userRole'); // Elimina el rol de localStorage
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}