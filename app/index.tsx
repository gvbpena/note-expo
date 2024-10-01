import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

const Index = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user); // Sets to true if user exists, otherwise false
        });

        return unsubscribe; // Cleanup the listener on component unmount
    }, []);

    if (isLoggedIn === null) {
        // Still loading
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return <Redirect href={isLoggedIn ? "/home" : "/login"} />;
};

export default React.memo(Index);
