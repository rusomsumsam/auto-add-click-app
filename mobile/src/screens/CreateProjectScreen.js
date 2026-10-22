import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { api } from '../services/api';
import { theme } from '../theme';

export default function CreateProjectScreen({ navigation }) {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleCreate() {
        if (!name || !url) {
            return Alert.alert('Error', 'Name and URL are required');
        }
        setIsLoading(true);
        try {
            // ইউজার যদি http:// বা https:// না দেয়, তবে অটোমেটিক https:// যোগ হবে
            let finalUrl = url.trim();
            if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
                finalUrl = 'https://' + finalUrl;
            }

            await api.createProject(name, finalUrl, description);
            navigation.goBack(); // সফল হলে আগের স্ক্রিনে ফিরে যাবে
        } catch (error) {
            Alert.alert('Failed', error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Project Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. My Blog" />

            <Text style={styles.label}>Website URL</Text>
            <TextInput style={styles.input} value={url} onChangeText={setUrl} placeholder="https://example.com" autoCapitalize="none" keyboardType="url" />

            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput style={[styles.input, { height: 80 }]} value={description} onChangeText={setDescription} placeholder="Testing..." multiline />

            <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Project</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: theme.spacing.md, backgroundColor: theme.colors.background },
    label: { ...theme.typography.body, fontWeight: 'bold', color: theme.colors.text, marginBottom: 5, marginTop: theme.spacing.md },
    input: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, padding: 12 },
    button: { backgroundColor: theme.colors.success, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: theme.spacing.xl },
    buttonText: { color: theme.colors.white, fontSize: 16, fontWeight: 'bold' },
});