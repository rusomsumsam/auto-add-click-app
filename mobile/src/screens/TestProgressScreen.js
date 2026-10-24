import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { theme } from '../theme';

export default function TestProgressScreen({ route, navigation }) {
    const { testRunId } = route.params;
    const [testRun, setTestRun] = useState(null);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelled, setIsCancelled] = useState(false);

    useEffect(() => {
        let interval;

        const fetchStatus = async () => {
            try {
                const data = await api.getTestRun(testRunId);
                setTestRun(data.testRun);
                setIsLoading(false);

                // Test শেষ হলে results নিয়ে আসি
                if (data.testRun.status === 'completed' || data.testRun.status === 'failed') {
                    const resultsData = await api.getTestResults(testRunId);
                    setResults(resultsData.results);
                    clearInterval(interval);
                }
            } catch (err) {
                console.error('Status check failed:', err);
            }
        };

        fetchStatus();
        interval = setInterval(fetchStatus, 3000); // প্রতি ৩ সেকেন্ডে

        return () => clearInterval(interval);
    }, [testRunId]);

    const handleCancel = () => {
        setIsCancelled(true);
        navigation.goBack();
    };

    if (isLoading || !testRun) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Starting test...</Text>
            </View>
        );
    }

    const isDone = testRun.status === 'completed' || testRun.status === 'failed' || testRun.status === 'cancelled';
    const progress = testRun.totalDevices > 0
        ? (testRun.completedDevices / testRun.totalDevices) * 100
        : 0;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 26 }}>
            {/* Status Header */}
            <View style={styles.header}>
                <Ionicons
                    name={isDone ? 'checkmark-circle' : 'time'}
                    size={48}
                    color={isDone ? theme.colors.success : theme.colors.primary}
                />
                <Text style={styles.statusText}>
                    {isDone ? 'Test Completed' : 'Test Running...'}
                </Text>
                <Text style={styles.projectName}>{testRun.project?.name}</Text>
            </View>

            {/* Progress Card */}
            <View style={styles.card}>
                <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>Progress</Text>
                    <Text style={styles.progressValue}>
                        {testRun.completedDevices} / {testRun.totalDevices}
                    </Text>
                </View>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressPercent}>{Math.round(progress)}% complete</Text>
            </View>

            {/* Summary */}
            {isDone && (
                <View style={styles.summaryCard}>
                    <View style={styles.summaryItem}>
                        <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
                        <Text style={styles.summaryValue}>{testRun.summary.passed}</Text>
                        <Text style={styles.summaryLabel}>Passed</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Ionicons name="close-circle" size={24} color={theme.colors.danger} />
                        <Text style={styles.summaryValue}>{testRun.summary.failed}</Text>
                        <Text style={styles.summaryLabel}>Failed</Text>
                    </View>
                </View>
            )}

            {/* Device Results */}
            {results.length > 0 && (
                <View style={styles.resultsCard}>
                    <Text style={styles.resultsTitle}>Device Results</Text>
                    {results.map((r) => (
                        <View key={r._id} style={styles.resultRow}>
                            <Ionicons
                                name={r.status === 'passed' ? 'checkmark-circle' : 'close-circle'}
                                size={20}
                                color={r.status === 'passed' ? theme.colors.success : theme.colors.danger}
                            />
                            <View style={styles.resultInfo}>
                                <Text style={styles.resultDevice}>{r.deviceProfile.name}</Text>
                                <Text style={styles.resultDuration}>{r.durationMs}ms</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {/* Actions */}
            {!isDone && (
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            )}
            {isDone && (
                <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.doneText}>Back to Dashboard</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.md },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
    loadingText: { marginTop: 12, color: theme.colors.textLight },
    header: { alignItems: 'center', marginVertical: theme.spacing.lg },
    statusText: { ...theme.typography.subtitle, color: theme.colors.text, marginTop: 8 },
    projectName: { ...theme.typography.body, color: theme.colors.textLight, marginTop: 4 },
    card: { backgroundColor: theme.colors.white, padding: theme.spacing.md, borderRadius: 12, marginBottom: theme.spacing.md, elevation: 2 },
    progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    progressLabel: { ...theme.typography.body, color: theme.colors.textLight },
    progressValue: { ...theme.typography.body, fontWeight: 'bold', color: theme.colors.text },
    progressBarBg: { height: 12, backgroundColor: theme.colors.border, borderRadius: 6, overflow: 'hidden' },
    progressBarFill: { height: 12, backgroundColor: theme.colors.primary },
    progressPercent: { ...theme.typography.caption, color: theme.colors.textLight, marginTop: 8, textAlign: 'center' },
    summaryCard: { flexDirection: 'row', backgroundColor: theme.colors.white, borderRadius: 12, padding: theme.spacing.md, marginBottom: theme.spacing.md, justifyContent: 'space-around' },
    summaryItem: { alignItems: 'center' },
    summaryValue: { ...theme.typography.title, color: theme.colors.text, marginTop: 4 },
    summaryLabel: { ...theme.typography.caption, color: theme.colors.textLight },
    resultsCard: { backgroundColor: theme.colors.white, padding: theme.spacing.md, borderRadius: 12, marginBottom: theme.spacing.md },
    resultsTitle: { ...theme.typography.subtitle, color: theme.colors.text, marginBottom: theme.spacing.sm },
    resultRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderColor: theme.colors.border },
    resultInfo: { marginLeft: 8, flex: 1 },
    resultDevice: { ...theme.typography.body, color: theme.colors.text },
    resultDuration: { ...theme.typography.caption, color: theme.colors.textLight },
    cancelButton: { backgroundColor: theme.colors.danger, padding: 14, borderRadius: 8, alignItems: 'center' },
    cancelText: { color: theme.colors.white, fontWeight: 'bold' },
    doneButton: { backgroundColor: theme.colors.success, padding: 14, borderRadius: 8, alignItems: 'center' },
    doneText: { color: theme.colors.white, fontWeight: 'bold' },
});