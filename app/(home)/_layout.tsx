import React from "react";
import { Text, Pressable, Alert, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";

export default function TabLayout() {
    const router = useRouter(); // To navigate after logout

    const handleLogout = async () => {
        try {
            await signOut(auth); // Call Firebase signOut
            router.replace("/login"); // Navigate to login screen after sign out
        } catch (error) {
            console.error("Error signing out: ", error);
            Alert.alert("Error", "There was a problem logging out. Please try again.");
        }
    };

    // const handleLogout = () => {
    //     // Add your logout functionality here
    //     Alert.alert(
    //         "Logout",
    //         "Are you sure you want to logout?",
    //         [
    //             { text: "Cancel", style: "cancel" },
    //             {
    //                 text: "Logout",
    //                 onPress: () => {
    //                     // Navigate to the login screen or perform other actions after logout
    //                     router.replace("/login");
    //                 },
    //                 style: "destructive",
    //             },
    //         ],
    //         { cancelable: true }
    //     );
    // };

    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: "Map",
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="map" color={color} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
                    headerRight: () => (
                        <Pressable style={styles.logoutButton} onPress={handleLogout}>
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </Pressable>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    logoutButton: {
        backgroundColor: "#ff4d4d", // Red color for the button
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginRight: 15,
    },
    logoutButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "500",
    },
});
