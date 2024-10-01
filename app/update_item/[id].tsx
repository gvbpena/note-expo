import React, { useState, useRef, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Alert, ScrollView, TouchableOpacity, Pressable, Image } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Region, LatLng } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { createNote, updateNote, getNoteById, removeImageFromNote } from "../../services/note_service"; // Import updateNote and getNoteById
import { useLocalSearchParams } from "expo-router"; // Import useLocalSearchParams for id handling

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

const AddNotemap: React.FC = () => {
    const { id } = useLocalSearchParams(); // Use id from local search params
    const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
    const [markerText, setMarkerText] = useState<string>("");
    const mapRef = useRef<MapView>(null);
    const [region, setRegion] = useState<Region>();
    const [content, setContent] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [noteData, setNoteData] = useState<Note | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>(noteData?.imageUrls || []);

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
    }, [removeImageFromNote]);

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
        return null;
    };

    const handleSave = async () => {
        if (title && content && markerPosition) {
            const data = {
                title,
                content: content,
                location: {
                    latitude: markerPosition.latitude,
                    longitude: markerPosition.longitude,
                },
                imageUrls: selectedImages.length > 0 ? selectedImages : null,
                createdAt: new Date().toISOString(),
                authorId: "123412412",
            };

            try {
                if (id) {
                    await updateNote(id as string, data);
                    Alert.alert("Note Updated");
                } else {
                    await createNote(data); // Create new note
                    Alert.alert("Note Saved");
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    Alert.alert("Error Saving Note", error.message);
                } else {
                    Alert.alert("Error Saving Note", "An unknown error occurred.");
                }
            }
        } else {
            Alert.alert("Error", "Please fill all fields and select a location.");
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <TextInput style={styles.input} placeholder="Enter Title" value={title} onChangeText={setTitle} placeholderTextColor="#888" />
                    <TextInput
                        style={[styles.input, styles.contentInput]}
                        placeholder="Enter content"
                        value={content}
                        onChangeText={setContent}
                        placeholderTextColor="#888"
                        multiline
                    />
                </View>
                <MapView
                    style={styles.map}
                    initialRegion={region}
                    showsUserLocation
                    showsMyLocationButton
                    provider={PROVIDER_GOOGLE}
                    ref={mapRef}
                    onRegionChangeComplete={onRegionChange}
                    onPress={handleMapPress}
                    mapPadding={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    region={region}
                >
                    {markerPosition && (
                        <Marker coordinate={markerPosition} title="Selected Location">
                            <Callout>
                                <View style={{ padding: 10 }}>
                                    <Text style={{ fontSize: 24 }}>Selected Location</Text>
                                </View>
                            </Callout>
                        </Marker>
                    )}
                </MapView>

                {markerPosition && (
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{markerText}</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.button} onPress={pickImageOrTakePhoto}>
                    <Text style={styles.buttonText}>Select Image</Text>
                </TouchableOpacity>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                    {renderSelectedImages()}
                </ScrollView>
                {renderNoteImages()}
                <Pressable style={[styles.button, styles.saveButton]} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    deleteButton: {
        position: "absolute",
        top: 5,
        right: 5,
        zIndex: 1,
        backgroundColor: "red",
        borderRadius: 20,
        padding: 5,
    },
    formContainer: {
        padding: 10,
    },
    input: {
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: "white",
    },
    contentInput: {
        height: 100,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: "#28a745",
    },
    imageScroll: {
        marginVertical: 10,
    },
    imageContainer: {
        marginRight: 10,
        position: "relative",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        margin: 5,
    },
    imagesHeader: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    map: {
        width: "100%",
        height: 300,
        marginBottom: 10,
    },
    textContainer: {
        padding: 10,
    },
    text: {
        fontSize: 16,
    },
});

export default AddNotemap;
