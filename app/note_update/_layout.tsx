import { Stack } from "expo-router";
import { Alert, Pressable, View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { deleteNote } from "../../services/note_service"; // Adjust the path based on your structure
import { useLocalSearchParams, useNavigation } from "expo-router"; // Importing necessary hooks

const Layout = () => {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();

    const handleDeleteNote = async () => {
        if (id) {
            Alert.alert(
                "Confirm Delete",
                "Are you sure you want to delete this note?",
                [
                    {
                        text: "Delete",
                        onPress: async () => {
                            try {
                                await deleteNote(id as string);
                                Alert.alert("Note Deleted");
                                navigation.goBack(); // Go back to the previous screen after deletion
                            } catch (error) {
                                Alert.alert("Error", "Failed to delete the note.");
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
        }
    };

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: "#fff" },
                headerTitleAlign: "center",
                headerTitle: "Edit",
                headerRight: () => (
                    <View style={{ flexDirection: "row", marginRight: 10 }}>
                        {id && (
                            <Pressable
                                style={styles.saveButton}
                                onPress={() => {
                                    /* Handle save logic here */
                                }}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </Pressable>
                        )}
                    </View>
                ),
            }}
        />
    );
};

const styles = StyleSheet.create({
    saveButton: {
        backgroundColor: "#000",
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Layout;
