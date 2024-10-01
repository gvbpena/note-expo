import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, ScrollView, Image, Modal, TouchableOpacity } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { getNoteById } from "../../services/note_service";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

interface Note {
    id?: string;
    title?: string;
    content?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    imageUrls?: string[];
    createdAt?: string;
    authorId?: string;
}

const NoteDetails: React.FC = () => {
    const { id } = useLocalSearchParams();
    const [noteData, setNoteData] = useState<Note | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fetchNoteData = async () => {
        try {
            const response = await getNoteById(id as string);
            setNoteData(response);
        } catch (error) {
            console.error("Failed to fetch note data:", error);
        }
    };

    useEffect(() => {
        fetchNoteData();
    }, [id]);

    useFocusEffect(
        useCallback(() => {
            fetchNoteData();
        }, [])
    );

    if (!noteData) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    const openModal = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{noteData.title}</Text>
            <Text style={styles.author}>Author: {noteData.authorId}</Text>
            <Text style={styles.createdAt}>Created At: {new Date(noteData.createdAt!).toLocaleString()}</Text>
            <Text style={styles.contentHeader}>content:</Text>
            <Text style={styles.content}>{noteData.content}</Text>

            <Text style={styles.locationHeader}>Location:</Text>
            {noteData.location && (
                <Text style={styles.location}>
                    [{noteData.location.latitude}° N, {noteData.location.longitude}° E]
                </Text>
            )}

            {noteData.location && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: noteData.location.latitude,
                        longitude: noteData.location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    provider={PROVIDER_GOOGLE}
                >
                    <Marker
                        coordinate={{
                            latitude: noteData.location.latitude,
                            longitude: noteData.location.longitude,
                        }}
                        title="Note Location"
                        description={noteData.content}
                    />
                </MapView>
            )}

            {noteData.imageUrls && noteData.imageUrls.length > 0 && (
                <View style={styles.imageContainer}>
                    <Text style={styles.imagesHeader}>Images:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {noteData.imageUrls.map((imageUri, index) => (
                            <TouchableOpacity key={index} onPress={() => openModal(imageUri)}>
                                <Image source={{ uri: imageUri }} style={styles.image} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
            {selectedImage && (
                <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={closeModal}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
                            <Text style={styles.closeText}>X</Text>
                        </TouchableOpacity>
                        <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />
                    </View>
                </Modal>
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
    contentHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    content: {
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
    map: {
        width: "100%",
        height: 300,
        borderRadius: 10,
        marginBottom: 20,
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
        width: 100, // Adjust width as needed
        height: 100, // Adjust height as needed
        borderRadius: 10,
        marginRight: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    modalClose: {
        position: "absolute",
        top: 40,
        right: 30,
        zIndex: 1,
    },
    closeText: {
        fontSize: 24,
        color: "#fff",
    },
    modalImage: {
        width: "100%",
        height: "100%",
    },
});

export default NoteDetails;
