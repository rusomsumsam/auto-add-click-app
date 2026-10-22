import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // অ্যাপ চালু হলে চেক করি টোকেন আছে কিনা
        async function loadUser() {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                if (token) {
                    const data = await api.getMe();
                    setUser(data.user);
                }
            } catch (error) {
                console.log('Failed to load user', error);
                await SecureStore.deleteItemAsync('userToken');
            } finally {
                setIsLoading(false);
            }
        }
        loadUser();
    }, []);

    async function login(email, password) {
        const data = await api.login(email, password);
        await SecureStore.setItemAsync('userToken', data.token);
        setUser(data.user);
    }

    async function register(email, password, name) {
        const data = await api.register(email, password, name);
        await SecureStore.setItemAsync('userToken', data.token);
        setUser(data.user);
    }

    async function logout() {
        await SecureStore.deleteItemAsync('userToken');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}