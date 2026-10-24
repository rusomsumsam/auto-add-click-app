import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { theme } from '../theme';

export default function TestHistoryScreen({ navigation }) {
    const [testRuns, setTestRuns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchHistory = async () => {
        try {
            const data = await api.getTestRuns();
            setTestRuns(data.testRuns);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHistory();
        }, [])
    );

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchHistory();
    };

    const getStatusIcon = (status) => {
        if (status === 'completed') return { name: 'checkmark-circle', color: theme.colors.success };
        if (status === 'failed') return { name: 'close-circle', color: theme.colors.danger };
        if (status === 'running') return { name: 'time', color: theme.colors.primary };
        return { name: 'hourglass', color: theme.colors.textLight };
    };

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const renderItem = ({ item }) => {
        const icon = getStatusIcon(item.status);
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('TestReport', { testRunId: item._id })}
            >
                <View style={styles.cardHeader}>
                    <Ionicons name={icon.name} size={28} color={icon.color} />
                    <View style={styles.cardInfo}>
                        <Text style={styles.projectName}>{item.project?.name || 'Unknown Project'}</Text>
                        <Text style={styles.statusText}>
                            {item.status.toUpperCase()} • {item.completedDevices}/{item.totalDevices} devices
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
                </View>
                <View style={styles.cardFooter}>
                    <Text style={styles.dateText}>
                        {new Date(item.createdAt).toLocaleString()}
                    </Text>
                    <Text style={styles.summaryText}>
                        ✅ {item.summary?.passed || 0}  ❌ {item.summary?.failed || 0}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {testRuns.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons name="time-outline" size={64} color={theme.colors.textLight} />
                    <Text style={styles.emptyTitle}>No test history yet</Text>
                    <Text style={styles.emptySub}>Run your first test to see it here.</Text>
                </View>
            ) : (
                <FlatList
                    data={testRuns}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg },
    list: { padding: theme.spacing.md },
    card: { backgroundColor: theme.colors.white, borderRadius: 12, padding: theme.spacing.md, marginBottom: theme.spacing.md, elevation: 2 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm },
    cardInfo: { flex: 1, marginLeft: 12 },
    projectName: { ...theme.typography.subtitle, color: theme.colors.text },
    statusText: { ...theme.typography.caption, color: theme.colors.textLight, marginTop: 2 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: theme.colors.border, paddingTop: theme.spacing.sm },
    dateText: { ...theme.typography.caption, color: theme.colors.textLight },
    summaryText: { ...theme.typography.caption, color: theme.colors.text },
    emptyTitle: { ...theme.typography.subtitle, color: theme.colors.text, marginTop: 12 },
    emptySub: { ...theme.typography.body, color: theme.colors.textLight, marginTop: 4 },
});