import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { theme } from '../theme';

export default function TestReportScreen({ route }) {
    const { testRunId } = route.params;
    const [testRun, setTestRun] = useState(null);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const [runData, resultsData] = await Promise.all([
                    api.getTestRun(testRunId),
                    api.getTestResults(testRunId),
                ]);
                setTestRun(runData.testRun);
                setResults(resultsData.results);
            } catch (error) {
                Alert.alert('Error', error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReport();
    }, [testRunId]);

    if (isLoading || !testRun) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const statusIcon = testRun.status === 'completed' ? 'checkmark-circle' : 'close-circle';
    const statusColor = testRun.status === 'completed' ? theme.colors.success : theme.colors.danger;

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons name={statusIcon} size={56} color={statusColor} />
                <Text style={styles.projectName}>{testRun.project?.name}</Text>
                <Text style={styles.projectUrl}>{testRun.project?.url}</Text>
                <Text style={styles.date}>{new Date(testRun.createdAt).toLocaleString()}</Text>
            </View>

            {/* Summary */}
            <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                        {testRun.summary?.passed || 0}
                    </Text>
                    <Text style={styles.summaryLabel}>Passed</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: theme.colors.danger }]}>
                        {testRun.summary?.failed || 0}
                    </Text>
                    <Text style={styles.summaryLabel}>Failed</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{testRun.totalDevices}</Text>
                    <Text style={styles.summaryLabel}>Devices</Text>
                </View>
            </View>

            {/* Per Device Results */}
            <Text style={styles.sectionTitle}>Device Results</Text>
            {results.map((r) => (
                <View key={r._id} style={styles.resultCard}>
                    <View style={styles.resultHeader}>
                        <Ionicons
                            name={r.status === 'passed' ? 'checkmark-circle' : 'close-circle'}
                            size={24}
                            color={r.status === 'passed' ? theme.colors.success : theme.colors.danger}
                        />
                        <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text style={styles.deviceName}>{r.deviceProfile?.name}</Text>
                            <Text style={styles.deviceMeta}>
                                {r.deviceProfile?.platform?.toUpperCase()} • {r.deviceProfile?.viewport?.width}x{r.deviceProfile?.viewport?.height}
                            </Text>
                        </View>
                        <Text style={styles.durationText}>{r.durationMs}ms</Text>
                    </View>

                    {/* Checks */}
                    {r.checks?.map((c, i) => (
                        <View key={i} style={styles.checkRow}>
                            <Ionicons
                                name={c.status === 'passed' ? 'checkmark' : 'close'}
                                size={16}
                                color={c.status === 'passed' ? theme.colors.success : theme.colors.danger}
                            />
                            <Text style={styles.checkName}>{c.name}</Text>
                            <Text style={styles.checkDetails} numberOfLines={1}>{c.details}</Text>
                        </View>
                    ))}

                    {/* Console Errors */}
                    {r.consoleErrors?.length > 0 && (
                        <View style={styles.errorsBox}>
                            <Text style={styles.errorsTitle}>⚠ Console Errors ({r.consoleErrors.length})</Text>
                            {r.consoleErrors.map((e, i) => (
                                <Text key={i} style={styles.errorItem} numberOfLines={2}>• {e.text}</Text>
                            ))}
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { alignItems: 'center', padding: theme.spacing.lg, backgroundColor: theme.colors.white, marginBottom: theme.spacing.md },
    projectName: { ...theme.typography.title, color: theme.colors.text, marginTop: 8 },
    projectUrl: { ...theme.typography.caption, color: theme.colors.textLight, marginTop: 4 },
    date: { ...theme.typography.caption, color: theme.colors.textLight, marginTop: 8 },
    summaryRow: { flexDirection: 'row', backgroundColor: theme.colors.white, padding: theme.spacing.md, marginBottom: theme.spacing.md, justifyContent: 'space-around' },
    summaryItem: { alignItems: 'center' },
    summaryValue: { ...theme.typography.title, color: theme.colors.text },
    summaryLabel: { ...theme.typography.caption, color: theme.colors.textLight, marginTop: 4 },
    sectionTitle: { ...theme.typography.subtitle, color: theme.colors.text, marginHorizontal: theme.spacing.md, marginBottom: theme.spacing.sm },
    resultCard: { backgroundColor: theme.colors.white, borderRadius: 12, padding: theme.spacing.md, marginHorizontal: theme.spacing.md, marginBottom: theme.spacing.md },
    resultHeader: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: theme.colors.border, paddingBottom: theme.spacing.sm, marginBottom: theme.spacing.sm },
    deviceName: { ...theme.typography.body, fontWeight: 'bold', color: theme.colors.text },
    deviceMeta: { ...theme.typography.caption, color: theme.colors.textLight },
    durationText: { ...theme.typography.caption, color: theme.colors.textLight, fontWeight: 'bold' },
    checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
    checkName: { ...theme.typography.body, color: theme.colors.text, marginLeft: 8, width: 100 },
    checkDetails: { ...theme.typography.caption, color: theme.colors.textLight, flex: 1 },
    errorsBox: { backgroundColor: '#fff5f5', borderRadius: 8, padding: 8, marginTop: 8 },
    errorsTitle: { ...theme.typography.caption, color: theme.colors.danger, fontWeight: 'bold', marginBottom: 4 },
    errorItem: { ...theme.typography.caption, color: theme.colors.danger, marginVertical: 2 },
});