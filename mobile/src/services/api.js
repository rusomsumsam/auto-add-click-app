import * as SecureStore from 'expo-secure-store';

// ⚠️ আপনার কম্পিউটারের লোকাল IP দিন (যেমন: 192.168.0.175)
// ফোনের Expo Go এবং কম্পিউটার একই Wi-Fi-তে থাকতে হবে।
const BASE_URL = 'http://192.168.0.175:5000/api';

async function getToken() {
    try {
        return await SecureStore.getItemAsync('userToken');
    } catch (error) {
        return null;
    }
}

async function request(endpoint, options = {}) {
    const token = await getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

export const api = {
    register: (email, password, name) =>
        request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        }),

    login: (email, password) =>
        request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    getMe: () => request('/me'),

    getProjects: () => request('/projects'),

    createProject: (name, url, description) =>
        request('/projects', {
            method: 'POST',
            body: JSON.stringify({ name, url, description }),
        }),

    updateProject: (id, data) =>
        request(`/projects/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    deleteProject: (id) =>
        request(`/projects/${id}`, {
            method: 'DELETE',
        }),
};