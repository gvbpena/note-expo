import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
// import Note_List from "../../components/note_list";
import Icon from "react-native-vector-icons/MaterialIcons"; // For the "+" icon
import { Href, Link, router } from "expo-router";
import NoteList from "../../components/note_list";

const Home = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome to Notemap</Text>
            <NoteList />
            <Link href="/note_add/" asChild>
                <Pressable style={styles.floatingButton}>
                    <Icon name="add" size={28} color="#fff" />
                    <Text style={styles.floatingButtonText}>Add Notes</Text>
                </Pressable>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 16,
        marginTop: 50,
        justifyContent: "center",
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center",
        marginBottom: 24,
    },
    floatingButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        right: 20,
        bottom: 30,
        backgroundColor: "#000", // Black color for the button
        borderRadius: 30,
        paddingVertical: 14,
        paddingHorizontal: 22,
        elevation: 8, // Shadow for Android
        shadowColor: "#000", // Shadow for iOS
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    floatingButtonText: {
        color: "#fff", // White text on black button
        fontSize: 18,
        marginLeft: 10, // Spacing between the icon and text
        fontWeight: "500",
    },
});

export default Home;
