import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function DashboardScreen() {
    const { user, logout } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>Welcome, {user?.name || 'User'}!</Text>
            <Text style={styles.email}>{user?.email}</Text>

            <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    subtitle: { fontSize: 20, marginBottom: 5, color: '#555' },
    email: { fontSize: 16, color: '#888', marginBottom: 40 },
    button: { backgroundColor: '#dc3545', padding: 15, borderRadius: 8, paddingHorizontal: 40 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});