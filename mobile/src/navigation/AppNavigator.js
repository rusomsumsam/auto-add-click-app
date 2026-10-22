import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null; // অথবা এখানে একটি Loading Screen দেখাতে পারেন
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    // যদি ইউজার লগইন থাকে
                    <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
                ) : (
                    // যদি ইউজার লগইন না থাকে
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Sign Up' }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}