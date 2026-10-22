import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

export default function DashboardScreen() {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>Welcome, {user?.name || 'User'}!</Text>
            <Text style={styles.info}>Select a tab below to get started.</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg, backgroundColor: theme.colors.background },
    title: { ...theme.typography.title, color: theme.colors.text, marginBottom: theme.spacing.sm },
    subtitle: { ...theme.typography.subtitle, color: theme.colors.text, marginBottom: theme.spacing.lg },
    info: { ...theme.typography.body, color: theme.colors.textLight },
});