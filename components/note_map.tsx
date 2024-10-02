import React, { useState, useEffect, useRef, useCallback } from "react";
import { Text, View, StyleSheet } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE, LatLng } from "react-native-maps";
import { getAllNotes, Note } from "../services/note_service"; // Adjust the import based on your file structure
import { useFocusEffect } from "expo-router";

const INITIAL_REGION = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

const AddNotemap = () => {
    const mapRef = useRef<MapView>(null);
    const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
    const [markerText, setMarkerText] = useState<string>("");
    const [notes, setNotes] = useState<Note[]>([]);
    const fetchNotes = async () => {
        try {
            const fetchedNotes = await getAllNotes();
            setNotes(fetchedNotes);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };
    useEffect(() => {
        fetchNotes();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchNotes(); // Refetch notes when the screen comes into focus
        }, [])
    );

    return (
        <MapView
            style={styles.map}
            // initialRegion={INITIAL_REGION}
            showsUserLocation
            showsMyLocationButton
            provider={PROVIDER_GOOGLE}
            ref={mapRef}
        >
            {markerPosition && (
                <Marker coordinate={markerPosition} title="Selected Location">
                    <Callout>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontSize: 16 }}>{markerText}</Text>
                        </View>
                    </Callout>
                </Marker>
            )}

            {notes.map(
                (note, index) =>
                    note.location && (
                        <Marker key={index} coordinate={note.location} title={note.title}>
                            <Callout>
                                <View style={{ padding: 10 }}>
                                    <Text style={{ fontSize: 16 }}>{note.title}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    )
            )}
        </MapView>
    );
};

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: "100%",
        marginBottom: 10,
    },
});

export default AddNotemap;
