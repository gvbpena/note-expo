import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router"; // Ensure you have this installed
import { getSpecificNoteDataById } from "../../services/note_service";

interface Note {
    id?: string;
    title?: string;
    description?: string; // Include description in the interface
    location?: {
        latitude: number;
        longitude: number;
    };
    imageUrls?: string[]; // Assuming imageUrls will be an array of strings
    createdAt?: string;
    authorId?: string;
}

const NoteDetails: React.FC = () => {
    const { id } = useLocalSearchParams(); // Get the note ID from the params
    const [noteData, setNoteData] = useState<Note | null>(null);

    useEffect(() => {
        const fetchNoteData = async () => {
            try {
                const response = await getSpecificNoteDataById(id as string);
                setNoteData(response);
            } catch (error) {
                console.error("Failed to fetch note data:", error);
            }
        };

        fetchNoteData();
    }, [id]);

    if (!noteData) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{noteData.title}</Text>
            <Text style={styles.author}>Author: {noteData.authorId}</Text>
            <Text style={styles.createdAt}>Created At: {new Date(noteData.createdAt!).toLocaleString()}</Text>

            {/* Displaying the description as specified */}
            <Text style={styles.descriptionHeader}>Description:</Text>
            <Text style={styles.description}>{noteData.description}</Text>

            <Text style={styles.locationHeader}>Location:</Text>
            {noteData.location && (
                <Text style={styles.location}>
                    [{noteData.location.latitude}° N, {noteData.location.longitude}° E]
                </Text>
            )}

            {noteData.imageUrls && noteData.imageUrls.length > 0 && (
                <View style={styles.imageContainer}>
                    <Text style={styles.imagesHeader}>Images:</Text>
                    {noteData.imageUrls.map((imageUri, index) => (
                        <Image key={index} source={{ uri: imageUri }} style={styles.image} />
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 18,
        color: "#888",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    author: {
        fontSize: 16,
        marginBottom: 5,
        color: "#555",
    },
    createdAt: {
        fontSize: 14,
        marginBottom: 15,
        color: "#777",
    },
    descriptionHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
        color: "#333",
    },
    locationHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    location: {
        fontSize: 16,
        marginBottom: 20,
        color: "#555",
    },
    imageContainer: {
        marginTop: 10,
    },
    imagesHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
});

export default NoteDetails;
