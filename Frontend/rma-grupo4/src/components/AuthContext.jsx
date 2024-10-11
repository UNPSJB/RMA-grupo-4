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

    // Efecto para actualizar localStorage cada vez que cambie isAuthenticated o user
    useEffect(() => {
        localStorage.setItem('isAuthenticated', isAuthenticated);
        if (user) {
            localStorage.setItem('user', user);
        } else {
            localStorage.removeItem('user');
        }
    }, [isAuthenticated, user]);

    const login = (username) => {
        setIsAuthenticated(true);
        setUser(username);
        localStorage.setItem(`token_${username}`, 'your_token_value'); // Guarda el token en localStorage (si es necesario)
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem(`token_${user}`); // Elimina el token de localStorage
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}