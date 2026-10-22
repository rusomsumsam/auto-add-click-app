import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function ProvidersScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Providers</Text>
            <Text style={styles.subtitle}>Connect to Monetag & Ads Spaark (Coming soon)</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background },
    title: { ...theme.typography.title, color: theme.colors.text },
    subtitle: { ...theme.typography.body, color: theme.colors.textLight, marginTop: theme.spacing.md },
});