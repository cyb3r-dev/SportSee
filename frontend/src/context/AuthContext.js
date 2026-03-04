import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import dataService from '../services/dataService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchUser = useCallback(async () => {
        if (localStorage.getItem('token')) {
            try {
                const userData = await dataService.getUserInfo();
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                localStorage.removeItem('token');
                setError(error.message);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);
    const login = async (username, password) => {
        setError(null);
        try {
            const data = await dataService.login(username, password);
            localStorage.setItem('token', data.token);
            dataService.setAuthToken(data.token);
            const userData = await dataService.getUserInfo();
            setUser(userData);
            return userData;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        dataService.setAuthToken(null);
        setUser(null);
    };
    const value = { user, loading, error, login, logout };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};