import { Link, Stack } from "expo-router";
import { Alert, Pressable, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { deleteNote } from "../../services/note_service"; // Adjust the path based on your structure
import { useLocalSearchParams, useNavigation } from "expo-router"; // Importing necessary hooks

const Layout = () => {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: "#fff" },
                headerTitleAlign: "center",
                headerTitle: "Edit",
            }}
        />
    );
};

export default Layout;
