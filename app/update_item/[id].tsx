import React, { useState, useRef, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Platform, ScrollView, TouchableOpacity, Alert, Pressable, Image } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Region, LatLng } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { createNote, updateNote, getNoteById } from "../../services/note_service"; // Import updateNote and getNoteById
import { useLocalSearchParams } from "expo-router"; // Import useLocalSearchParams for id handling

const INITIAL_REGION = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

interface Note {
    id?: string;
    title?: string;
    content?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    images?: string[];
}

const AddNotemap: React.FC = () => {
    const { id } = useLocalSearchParams(); // Use id from local search params
    const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
    const [markerText, setMarkerText] = useState<string>("");
    const mapRef = useRef<MapView>(null);
    const [region, setRegion] = useState<Region>(INITIAL_REGION);
    const [description, setDescription] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [noteData, setNoteData] = useState<Note | null>(null);

    useEffect(() => {
        const fetchNoteData = async () => {
            if (id) {
                try {
                    const response = await getNoteById(id as string);
                    console.log(response); // Log the response to verify its structure
                    const note: Note = response; // Ensure it matches the Note type
                    setNoteData(note);
                } catch (error) {
                    console.error("Failed to fetch note data:", error);
                }
            }
        };

        fetchNoteData();
    }, [id]);

    if (noteData) {
        console.log(noteData.title); // This should work without errors
    }
    if (!noteData) {
        return <Text>Loading...</Text>; // Handle loading state
    }

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

    const renderSelectedImages = () => {
        return selectedImages.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
                <Pressable onPress={() => deleteImage(image)} style={styles.deleteButton}>
                    <Ionicons name="trash-bin" size={20} color="white" />
                </Pressable>
                <Image source={{ uri: image }} style={styles.image} />
            </View>
        ));
    };

    const handleSave = async () => {
        if (title && description && markerPosition) {
            const data = {
                title,
                content: description,
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
                    await updateNote(id as string, data); // Update note if ID is provided
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
                        style={[styles.input, styles.descriptionInput]}
                        placeholder="Enter Description"
                        value={description}
                        onChangeText={setDescription}
                        placeholderTextColor="#888"
                        multiline
                    />
                </View>

                {Platform.OS === "web" ? (
                    <View style={styles.noMapContainer}>
                        <Text style={styles.noMapText}>No map available on web platform</Text>
                    </View>
                ) : (
                    <MapView
                        style={styles.map}
                        initialRegion={INITIAL_REGION}
                        showsUserLocation
                        showsMyLocationButton
                        provider={PROVIDER_GOOGLE}
                        ref={mapRef}
                        onRegionChangeComplete={onRegionChange}
                        onPress={handleMapPress}
                        mapPadding={{ top: 10, right: 10, bottom: 10, left: 10 }}
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
                )}

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
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "white",
        zIndex: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        borderColor: "#ddd",
        borderWidth: 1,
    },
    imageContainer: {
        position: "relative",
        marginRight: 10,
    },
    imageScroll: {
        marginVertical: 10,
        maxHeight: 200,
    },
    input: {
        backgroundColor: "#f9f9f9",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        fontSize: 16,
        marginBottom: 10,
    },
    descriptionInput: {
        height: 100,
    },
    map: {
        width: "100%",
        height: 400,
    },
    noMapContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noMapText: {
        fontSize: 18,
    },
    textContainer: {
        padding: 10,
    },
    text: {
        fontSize: 14,
    },
    button: {
        backgroundColor: "#007BFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 20,
        alignItems: "center",
    },
    saveButton: {
        backgroundColor: "#28a745",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
});

export default AddNotemap;
