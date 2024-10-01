import React, { useState, useRef, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Alert, ScrollView, TouchableOpacity, Pressable, Image } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Region, LatLng } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { createNote, updateNote, getNoteById, removeImageFromNote } from "../../services/note_service"; // Import updateNote and getNoteById
import { useLocalSearchParams } from "expo-router"; // Import useLocalSearchParams for id handling
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation for navigation

interface Note {
    id?: string;
    title?: string;
    content?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    images?: string[];
    imageUrls?: string[]; // Add imageUrls to the Note interface
}

const UpdateNoteMap: React.FC = () => {
    const { id } = useLocalSearchParams(); // Use id from local search params
    const navigation = useNavigation(); // Initialize navigation
    const [loading, setLoading] = useState(false); // Loading state
    const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
    const [markerText, setMarkerText] = useState<string>("");
    const mapRef = useRef<MapView>(null);
    const [region, setRegion] = useState<Region>();
    const [content, setContent] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [noteData, setNoteData] = useState<Note | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>(noteData?.imageUrls || []);

    const handleSave = async () => {
        if (title && content && markerPosition) {
            setLoading(true); // Set loading to true
            const combinedImages = [...(noteData?.imageUrls || []), ...selectedImages];

            const data = {
                title,
                content,
                location: {
                    latitude: markerPosition.latitude,
                    longitude: markerPosition.longitude,
                },
                imageUrls: combinedImages.length > 0 ? combinedImages : null,
                createdAt: new Date().toISOString(),
                authorId: getAuth().currentUser?.uid,
            };
            try {
                if (id) {
                    await updateNote(id as string, data);
                    Alert.alert("Note Updated");
                } else {
                    await createNote(data);
                    Alert.alert("Note Saved");
                }
                navigation.goBack(); // Go back after saving
            } catch (error: unknown) {
                if (error instanceof Error) {
                    Alert.alert("Error Saving Note", error.message);
                } else {
                    Alert.alert("Error Saving Note", "An unknown error occurred.");
                }
            } finally {
                setLoading(false); // Set loading to false after the operation
            }
        } else {
            Alert.alert("Error", "Please fill all fields and select a location.");
        }
    };

    useEffect(() => {
        const fetchNoteData = async () => {
            if (id) {
                try {
                    const response = await getNoteById(id as string);
                    const note: Note = response;

                    setNoteData(note);

                    if (note.location) {
                        const { latitude, longitude } = note.location;
                        setMarkerPosition({ latitude, longitude });
                        setRegion({
                            latitude,
                            longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        });
                    }

                    setTitle(note.title || ""); // Populate title
                    setContent(note.content || ""); // Populate content
                    setSelectedImages(note.images || []); // Populate images
                } catch (error) {
                    console.error("Failed to fetch note data:", error);
                }
            }
        };

        // Fetch data only when 'id' changes
        if (id) {
            fetchNoteData();
        }
    }, [id]);

    useEffect(() => {
        // Update imageUrls only when noteData changes
        if (noteData?.imageUrls) {
            setImageUrls(noteData.imageUrls);
        }
    }, [noteData]);

    const handleMapPress = (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setMarkerPosition({ latitude, longitude });
        setMarkerText(`Location at Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
    };

    const onRegionChange = (newRegion: Region) => {
        setRegion(newRegion);
    };

    const launchCamera = async () => {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPermission.status !== "granted") {
            Alert.alert("Permission required", "Permission to access camera is required!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImages((prev) => [...prev, result.assets[0].uri]);
        }
    };

    const launchImageLibrary = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const images = result.assets.map((asset) => asset.uri);
            setSelectedImages((prev) => [...prev, ...images]);
        }
    };

    const pickImageOrTakePhoto = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.status !== "granted") {
            Alert.alert("Permission required", "Permission to access media library is required!");
            return;
        }

        Alert.alert("Choose an action", "Select an action:", [
            {
                text: "Take Photo",
                onPress: () => launchCamera(),
            },
            {
                text: "Choose from Gallery",
                onPress: () => launchImageLibrary(),
            },
            {
                text: "Cancel",
                style: "cancel",
            },
        ]);
    };

    const deleteImage = (imageUri: string) => {
        setSelectedImages((prev) => prev.filter((image) => image !== imageUri));
    };

    const deleteExistingImage = (imageUri: string) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this image?",
            [
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await removeImageFromNote(id as string, imageUri);
                            if (noteData?.imageUrls) {
                                const updatedImageUrls = noteData.imageUrls.filter((uri) => uri !== imageUri);
                                setNoteData((prevNoteData) => (prevNoteData ? { ...prevNoteData, imageUrls: updatedImageUrls } : prevNoteData));
                            }
                        } catch (error) {
                            if (error instanceof Error) {
                                Alert.alert("Error", error.message);
                            } else {
                                Alert.alert("Error", "An unknown error occurred.");
                            }
                        }
                    },
                    style: "destructive",
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ],
            { cancelable: false }
        );
    };

    const renderSelectedImages = () => {
        return (
            <View style={styles.imageContainer}>
                <Text style={styles.imagesHeader}>Selected Images:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {selectedImages.map((image, index) => (
                        <View key={index}>
                            <Pressable onPress={() => deleteImage(image)} style={styles.deleteButton}>
                                <Ionicons name="trash-bin" size={20} color="white" />
                            </Pressable>
                            <Image source={{ uri: image }} style={styles.image} />
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    };

    const renderNoteImages = () => {
        if (noteData?.imageUrls && noteData.imageUrls.length > 0) {
            return (
                <View style={styles.imageContainer}>
                    <Text style={styles.imagesHeader}>Existing Images:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {noteData.imageUrls.map((imageUri, index) => (
                            <View key={index}>
                                <Pressable onPress={() => deleteExistingImage(imageUri)} style={styles.deleteButton}>
                                    <Ionicons name="trash-bin" size={20} color="white" />
                                </Pressable>
                                <Image source={{ uri: imageUri }} style={styles.image} />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            );
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.headerText}>Update Note</Text>
                <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
                <TextInput style={styles.input} placeholder="Content" multiline numberOfLines={4} value={content} onChangeText={setContent} />
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    region={region}
                    onPress={handleMapPress}
                    onRegionChangeComplete={onRegionChange}
                >
                    {markerPosition && (
                        <Marker coordinate={markerPosition}>
                            <Callout>
                                <Text>{markerText}</Text>
                            </Callout>
                        </Marker>
                    )}
                </MapView>
                <TouchableOpacity style={styles.button} onPress={pickImageOrTakePhoto}>
                    <Text style={styles.buttonText}>Add Images</Text>
                </TouchableOpacity>
                {renderNoteImages()}
                {renderSelectedImages()}
                {loading ? (
                    <Text style={styles.loadingText}>Saving...</Text>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save Note</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1, // Ensures the ScrollView expands to fit the content
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        padding: 8,
        marginBottom: 16,
    },
    map: {
        width: "100%",
        height: 250,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#7B7F5E",
        padding: 12,
        borderRadius: 4,
        alignItems: "center",
        marginBottom: 16,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    loadingText: {
        textAlign: "center",
        fontSize: 18,
        marginVertical: 16,
    },
    imageContainer: {
        marginBottom: 16,
    },
    imagesHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 8,
    },
    deleteButton: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: "red",
        borderRadius: 12,
        padding: 4,
    },
});

export default UpdateNoteMap;
