import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

const Index = () => {
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Track login status

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (isLoading) {
        // Show loading indicator while checking authentication status
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (isLoggedIn) {
        return <Redirect href="/home" />; // Redirect to home if logged in
    } else {
        return <Redirect href="/login" />; // Redirect to login if not logged in
    }
};

export default Index;
