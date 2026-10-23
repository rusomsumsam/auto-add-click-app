import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // নতুন আইকন ইমপোর্ট
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import ProvidersScreen from '../screens/ProvidersScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CreateProjectScreen from '../screens/CreateProjectScreen';
import DeviceSelectionScreen from './../screens/DeviceSelectionScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textLight,
                headerShown: true,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Projects') {
                        iconName = focused ? 'folder' : 'folder-outline';
                    } else if (route.name === 'Providers') {
                        iconName = focused ? 'server' : 'server-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Projects" component={ProjectsScreen} />
            <Tab.Screen name="Providers" component={ProvidersScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    <>
                        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
                        <Stack.Screen name="CreateProject" component={CreateProjectScreen} options={{ title: 'New Project' }} />
                        <Stack.Screen name="DeviceSelection" component={DeviceSelectionScreen} options={{ title: 'Select Devices' }} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Sign Up' }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}