import { Link, Stack } from "expo-router";
import { Alert, Pressable, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { deleteNote } from "../../services/note_service"; // Adjust the path based on your structure
import { useLocalSearchParams, useNavigation } from "expo-router"; // Importing necessary hooks

const Layout = () => {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams(); // Use the id from local search parameters

    const handleDelete = () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this item?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await deleteNote(id as string);
                            navigation.goBack();
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
            ],
            { cancelable: false }
        );
    };

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: "#fff" },
                headerTitleAlign: "center",
                headerTitle: "view",
                headerRight: () => (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Link href={`/note_update/${id as string}`} asChild>
                            <Pressable>
                                <Icon name="edit" size={24} color="#000" style={{ marginRight: 15 }} />
                            </Pressable>
                        </Link>
                        <Pressable onPress={handleDelete}>
                            <Icon name="delete" size={24} color="red" />
                        </Pressable>
                    </View>
                ),
            }}
        />
    );
};

export default Layout;
