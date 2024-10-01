import { Link, Stack, useNavigation } from "expo-router";
import { Alert, Pressable, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
// import { , Link } from "expo-router";

const Layout = () => {
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
                    onPress: () => console.log("Item deleted"), // Handle the delete action here
                    style: "destructive",
                },
            ],
            { cancelable: false }
        );
    };
    // const navigation = useNavigation();

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: "#fff" },
                headerTitleAlign: "center",
                headerTitle: "View",
                headerRight: () => (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Link href="/note/update" asChild>
                            <Pressable>
                                <Icon name="edit" size={24} color="#000" style={{ marginRight: 15 }} />
                            </Pressable>
                        </Link>
                        <Pressable onPress={() => handleDelete()}>
                            <Icon name="delete" size={24} color="red" />
                        </Pressable>
                    </View>
                ),
            }}
        />
    );
};

export default Layout;
