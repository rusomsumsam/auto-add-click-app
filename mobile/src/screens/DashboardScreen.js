import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

export default function DashboardScreen({ navigation }) {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>Welcome, {user?.name || 'User'}!</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('DeviceSelection')}
            >
                <Text style={styles.buttonText}>Test a Website</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.background
    },
    title: {
        ...theme.typography.title,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm
    },
    subtitle: {
        ...theme.typography.subtitle,
        color: theme.colors.text,
        marginBottom: theme.spacing.xl
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginTop: theme.spacing.md,
    },
    buttonText: {
        color: theme.colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});