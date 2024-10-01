import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, TextInput, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { getAllNotes } from "../services/note_service"; // Ensure the path to your note_service is correct

interface Note {
    id: string;
    name: string;
    description: string;
    time: string;
}
interface ItemProps {
    name: string;
    description: string;
    time: string;
    onPress: () => void;
}

const Note_List = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState(""); // State for the search query
    const [notes, setNotes] = useState<Note[]>([]); // State for the notes
    const [loading, setLoading] = useState(true); // State for loading
    const [error, setError] = useState<string | null>(null); // State for error handling

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const fetchedNotes = await getAllNotes();
                setNotes(fetchedNotes);
                console.log(fetchedNotes);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch notes.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    // Filter the data based on the search query
    const filteredData = notes.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />; // Loading indicator
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>; // Display error message
    }

    return (
        <View style={styles.container}>
            {/* Modern Minimalist Search Input */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#888" // Placeholder text color
                value={searchQuery}
                onChangeText={setSearchQuery} // Update search query state
            />
            <FlatList
                data={filteredData} // Use filtered data for the FlatList
                renderItem={({ item }) => (
                    <Item name={item.name} description={item.description} time={item.time} onPress={() => router.push(`/item/${item.id}`)} />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

// Item component remains unchanged
const Item = ({ name, description, time, onPress }: ItemProps) => (
    <Pressable onPress={onPress} style={styles.item}>
        <View style={styles.itemHeader}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 16,
    },
    searchInput: {
        height: 48,
        backgroundColor: "#F5F5F5", // Light gray background for the input
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderColor: "#000", // Black border for contrast
        borderWidth: 1,
    },
    listContainer: {
        paddingBottom: 16,
    },
    item: {
        backgroundColor: "#FFFFFF",
        marginVertical: 8,
        borderRadius: 8,
        padding: 14,
        borderColor: "#000", // Black border for the card
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Elevation for a subtle shadow effect
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    time: {
        fontSize: 12,
        color: "#555", // Dark gray for secondary text
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000", // Strong black for main text
    },
    description: {
        fontSize: 14,
        color: "#333", // Slightly lighter black for description
        marginTop: 6,
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});

export default Note_List;
