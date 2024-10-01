import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Image, FlatList, Alert, TextInput } from "react-native";
import { Href, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getAuth } from "firebase/auth";
import { getUserProfile } from "../../services/auth_service"; // Adjust the path as necessary
import { DocumentData } from "firebase/firestore";

interface UserProfile {
    name: string;
    email: string;
}

const ProfileSettings = () => {
    const router = useRouter();
    const auth = getAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    const settingsOptions = [
        { id: "1", name: "Account Settings", icon: "settings", route: "account" },
        { id: "2", name: "Theme", icon: "palette", route: "darkmode" },
    ];

    const filteredOptions = settingsOptions.filter((option) => option.name.toLowerCase().includes(searchQuery.toLowerCase()));

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (auth.currentUser) {
                const profileData: DocumentData | { errorCode: any; errorMessage: any } = await getUserProfile(auth.currentUser.uid);
                if (profileData && !profileData.errorCode) {
                    setUserProfile(profileData as UserProfile);
                } else {
                    Alert.alert("Error", "Unable to fetch user profile data.");
                }
            }
        };

        fetchUserProfile();
    }, [auth.currentUser]);

    return (
        <View style={styles.container}>
            <View style={styles.profileSection}>
                <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.profilePicture} />
                <View style={styles.profileText}>
                    <Text style={styles.profileName}>{userProfile?.name || "Loading..."}</Text>
                    <Text style={styles.profilecontent}>{userProfile?.email || "Loading..."}</Text>
                </View>
            </View>

            {/* Search Bar */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search settings..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
            />

            <Text style={styles.settingsHeader}>Settings</Text>
            <FlatList
                data={filteredOptions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.settingOption}
                        onPress={() => {
                            if (item.route) router.push(item.route as Href);
                        }}
                    >
                        <View style={styles.optionContent}>
                            <Icon name={item.icon} size={24} color="#4F4F4F" style={styles.optionIcon} />
                            <Text style={styles.settingOptionText}>{item.name}</Text>
                        </View>
                        <Icon name="chevron-right" size={24} color="#888" style={styles.arrowIcon} />
                    </Pressable>
                )}
                ItemSeparatorComponent={() => <View style={styles.divider} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F6F6F6",
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        padding: 15,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    profilePicture: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
        borderWidth: 2,
        borderColor: "#ccc",
    },
    profileText: {
        justifyContent: "center",
    },
    profileName: {
        fontSize: 22,
        fontWeight: "600",
        color: "#333",
    },
    profilecontent: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    searchInput: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 16,
        color: "#333",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    settingsHeader: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginBottom: 10,
    },
    settingOption: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
    },
    optionContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    optionIcon: {
        marginRight: 15,
    },
    settingOptionText: {
        fontSize: 16,
        color: "#333",
    },
    arrowIcon: {
        marginLeft: "auto",
    },
    divider: {
        height: 15,
    },
});

export default ProfileSettings;
