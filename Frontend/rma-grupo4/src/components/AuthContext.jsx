// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // Estado para almacenar el usuario

    const login = (username) => {
        setIsAuthenticated(true);
        setUser(username); // Almacena el nombre de usuario
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null); // Borra el nombre de usuario al cerrar sesión
        localStorage.removeItem(`token_${user}`); // Elimina el token de localStorage
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
