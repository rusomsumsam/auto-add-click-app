import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { api } from '../services/api';
import { theme } from '../theme';

export default function ProjectsScreen() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const navigation = useNavigation();

    const fetchProjects = async () => {
        try {
            const data = await api.getProjects();
            setProjects(data.projects);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    // পেজে ফোকাস হলেই ডাটা রিফ্রেশ হবে
    useFocusEffect(
        useCallback(() => {
            fetchProjects();
        }, [])
    );

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchProjects();
    };

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardUrl}>{item.url}</Text>
            {item.description ? <Text style={styles.cardDesc}>{item.description}</Text> : null}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {projects.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>No projects yet.</Text>
                    <Text style={styles.emptySub}>Create one to get started.</Text>
                </View>
            ) : (
                <FlatList
                    data={projects}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    contentContainerStyle={styles.list}
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateProject')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: theme.spacing.md },
    card: { backgroundColor: theme.colors.white, padding: theme.spacing.md, borderRadius: 8, marginBottom: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border },
    cardTitle: { ...theme.typography.subtitle, color: theme.colors.text, marginBottom: 4 },
    cardUrl: { ...theme.typography.caption, color: theme.colors.primary, marginBottom: 4 },
    cardDesc: { ...theme.typography.body, color: theme.colors.textLight, fontSize: 14 },
    emptyText: { ...theme.typography.title, color: theme.colors.textLight },
    emptySub: { ...theme.typography.body, color: theme.colors.textLight, marginTop: 8 },
    fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 5 },
    fabText: { color: theme.colors.white, fontSize: 30, fontWeight: 'bold', lineHeight: 32 },
});