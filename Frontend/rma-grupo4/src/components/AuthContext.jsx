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
        const storedUser = localStorage.getItem('user');
        return storedUser ? storedUser : null;
    });

    const [userRole, setUserRole] = useState(() => {
        const storedRole = localStorage.getItem('userRole');
        return storedRole ? storedRole : null;
    });

    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem('token');
        return storedToken ? storedToken : null;
    });

    const [userId, setUserId] = useState(() => {
        const storedUserId = localStorage.getItem('userId');
        return storedUserId ? storedUserId : null;
    });

    useEffect(() => {
        if (isAuthenticated !== null) {
            localStorage.setItem('isAuthenticated', isAuthenticated);
        }
        if (user !== null) {
            localStorage.setItem('user', user);
        } else {
            localStorage.removeItem('user');
        }
        if (userRole !== null) {
            localStorage.setItem('userRole', userRole);
        } else {
            localStorage.removeItem('userRole');
        }
        if (token !== null) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [isAuthenticated, user, userRole, token]);

    const login = (username, role, authToken, userId) => {
        setIsAuthenticated(true);
        setUser(username);
        setUserId(userId);
        setUserRole(role);
        setToken(authToken); // Guarda el token
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
        setUserId(null);
        setToken(null);
    
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
    
        if (user) {
            localStorage.removeItem(`token_${user}`);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, userId, userRole, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export default AuthContext;
