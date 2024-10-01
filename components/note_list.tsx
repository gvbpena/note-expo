import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { getAllNotes } from "../services/note_service"; // Ensure this path is correct
import { useRouter } from "expo-router"; // Using expo-router for navigation

interface Note {
    id: string;
    title: string;
    createdAt: any; // Adjust this type as necessary based on your data structure
}

const NoteList = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter(); // For navigation

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const notesData = await getAllNotes();
                setNotes(notesData);
            } catch (error) {
                console.error("Failed to fetch notes: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    const renderItem = ({ item }: { item: Note }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => router.push(`/item/${item.id}`)}>
                <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
            <Text style={styles.date}>{item.createdAt}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <FlatList
            data={notes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.emptyMessage}>No notes found</Text>}
        />
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    itemContainer: {
        backgroundColor: "#f9f9f9",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderColor: "#e0e0e0",
        borderWidth: 1,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2, // For Android shadow
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#333",
    },
    date: {
        fontSize: 14,
        color: "#888",
        marginTop: 4,
    },
    emptyMessage: {
        textAlign: "center",
        fontSize: 16,
        color: "#aaa",
        marginTop: 20,
    },
});

export default NoteList;
