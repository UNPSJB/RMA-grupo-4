import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    // Recupera el estado de autenticación desde sessionStorage al cargar la aplicación
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedAuth = sessionStorage.getItem('isAuthenticated');
        return storedAuth === 'true'; // Convierte el string a booleano
    });
    
    const [user, setUser] = useState(() => {
        return sessionStorage.getItem('user'); // Recupera el nombre de usuario almacenado
    });

    // Efecto para actualizar sessionStorage cada vez que cambie isAuthenticated o user
    useEffect(() => {
        sessionStorage.setItem('isAuthenticated', isAuthenticated);
        if (user) {
            sessionStorage.setItem('user', user);
        } else {
            sessionStorage.removeItem('user');
        }
    }, [isAuthenticated, user]);

    const login = (username) => {
        setIsAuthenticated(true);
        setUser(username);
        sessionStorage.setItem(`token_${username}`, 'your_token_value'); // Guarda el token en sessionStorage (si es necesario)
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem(`token_${user}`); // Elimina el token de sessionStorage
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}