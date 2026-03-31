import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: null,
        user: null,
        isAuthenticated: false,
        loading: true,
    });

    const loadUserFromToken = useCallback(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedUser.exp < currentTime) {
                    localStorage.removeItem('token');
                    setAuth({ token: null, user: null, isAuthenticated: false, loading: false });
                } else {
                    setAuth({
                        token: token,
                        user: decodedUser.user,
                        isAuthenticated: true,
                        loading: false,
                    });
                }
            } catch (err) {
                localStorage.removeItem('token');
                setAuth({ token: null, user: null, isAuthenticated: false, loading: false });
            }
        } else {
            setAuth({ token: null, user: null, isAuthenticated: false, loading: false });
        }
    }, []);

    useEffect(() => {
        loadUserFromToken();
    }, [loadUserFromToken]);

    const login = (token) => {
        localStorage.setItem('token', token);
        loadUserFromToken(); 
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuth({
            token: null,
            user: null,
            isAuthenticated: false,
            loading: false,
        });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {!auth.loading && children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };