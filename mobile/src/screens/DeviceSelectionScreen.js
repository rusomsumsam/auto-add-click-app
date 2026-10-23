import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { theme } from '../theme';

export default function DeviceSelectionScreen({ navigation }) {
    const [devices, setDevices] = useState([]);
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [platform, setPlatform] = useState(''); // '' = all, 'android', 'ios'

    useEffect(() => {
        fetchDevices();
    }, [platform]);

    const fetchDevices = async () => {
        setIsLoading(true);
        try {
            const data = await api.getDevices(platform);
            setDevices(data.devices);
            setFilteredDevices(data.devices);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (text) => {
        setSearch(text);
        if (!text) {
            setFilteredDevices(devices);
            return;
        }
        const filtered = devices.filter(d =>
            d.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredDevices(filtered);
    };

    const toggleDevice = (deviceId) => {
        setSelectedDevices(prev =>
            prev.includes(deviceId)
                ? prev.filter(id => id !== deviceId)
                : [...prev, deviceId]
        );
    };

    const selectAll = () => {
        setSelectedDevices(filteredDevices.map(d => d._id));
    };

    const clearAll = () => {
        setSelectedDevices([]);
    };

    const handleStartTest = () => {
        if (selectedDevices.length === 0) {
            return Alert.alert('Error', 'Please select at least one device');
        }
        // পরের Phase-এ আমরা এখানে Test Runner স্ক্রিনে পাঠাব
        Alert.alert('Selected', `${selectedDevices.length} device(s) selected.`);
    };

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const renderItem = ({ item }) => {
        const isSelected = selectedDevices.includes(item._id);
        return (
            <TouchableOpacity
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => toggleDevice(item._id)}
            >
                <View style={styles.checkbox}>
                    {isSelected && <Ionicons name="checkmark" size={18} color={theme.colors.white} />}
                </View>
                <View style={styles.info}>
                    <Text style={styles.deviceName}>{item.name}</Text>
                    <Text style={styles.deviceDetails}>{item.platform.toUpperCase()} • {item.viewport.width}x{item.viewport.height}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={theme.colors.textLight} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search devices..."
                    value={search}
                    onChangeText={handleSearch}
                />
            </View>

            {/* Platform Filter */}
            <View style={styles.filters}>
                <TouchableOpacity
                    style={[styles.filterBtn, platform === '' && styles.filterBtnActive]}
                    onPress={() => setPlatform('')}
                >
                    <Text style={[styles.filterText, platform === '' && styles.filterTextActive]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterBtn, platform === 'android' && styles.filterBtnActive]}
                    onPress={() => setPlatform('android')}
                >
                    <Text style={[styles.filterText, platform === 'android' && styles.filterTextActive]}>Android</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterBtn, platform === 'ios' && styles.filterBtnActive]}
                    onPress={() => setPlatform('ios')}
                >
                    <Text style={[styles.filterText, platform === 'ios' && styles.filterTextActive]}>iOS</Text>
                </TouchableOpacity>
            </View>

            {/* Select All / Clear */}
            <View style={styles.actions}>
                <TouchableOpacity onPress={selectAll}>
                    <Text style={styles.actionText}>Select All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={clearAll}>
                    <Text style={[styles.actionText, { color: theme.colors.danger }]}>Clear</Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={filteredDevices}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />

            {/* Bottom Button */}
            <View style={styles.bottomBar}>
                <Text style={styles.selectedCount}>{selectedDevices.length} selected</Text>
                <TouchableOpacity style={styles.startButton} onPress={handleStartTest}>
                    <Text style={styles.startButtonText}>Start Test</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    searchContainer: { flexDirection: 'row', backgroundColor: theme.colors.white, margin: theme.spacing.md, borderRadius: 8, paddingHorizontal: 10, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, paddingVertical: 10 },
    filters: { flexDirection: 'row', paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.sm },
    filterBtn: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, backgroundColor: theme.colors.white, marginRight: 8, borderWidth: 1, borderColor: theme.colors.border },
    filterBtnActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    filterText: { color: theme.colors.textLight, fontWeight: 'bold' },
    filterTextActive: { color: theme.colors.white },
    actions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.sm },
    actionText: { color: theme.colors.primary, fontWeight: 'bold' },
    list: { paddingHorizontal: theme.spacing.md, paddingBottom: 100 },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.white, padding: theme.spacing.md, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: theme.colors.border },
    cardSelected: { borderColor: theme.colors.primary, backgroundColor: '#e6f2ff' },
    checkbox: { width: 24, height: 24, borderRadius: 4, borderWidth: 2, borderColor: theme.colors.border, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
    info: { flex: 1 },
    deviceName: { ...theme.typography.body, fontWeight: 'bold', color: theme.colors.text },
    deviceDetails: { ...theme.typography.caption, color: theme.colors.textLight },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.colors.white, padding: theme.spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: theme.colors.border },
    selectedCount: { ...theme.typography.body, fontWeight: 'bold' },
    startButton: { backgroundColor: theme.colors.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    startButtonText: { color: theme.colors.white, fontWeight: 'bold' },
});