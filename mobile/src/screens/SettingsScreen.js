import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

export default function SettingsScreen() {
    const { user, logout } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.info}>Name: {user?.name}</Text>
            <Text style={styles.info}>Email: {user?.email}</Text>
            <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background },
    title: { ...theme.typography.title, color: theme.colors.text, marginBottom: theme.spacing.lg },
    info: { ...theme.typography.body, color: theme.colors.text, marginBottom: theme.spacing.sm },
    button: { backgroundColor: theme.colors.danger, padding: 15, borderRadius: 8, marginTop: theme.spacing.xl, alignItems: 'center' },
    buttonText: { color: theme.colors.white, fontSize: 16, fontWeight: 'bold' },
});