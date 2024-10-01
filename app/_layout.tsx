import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="(home)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="account" options={{ headerShown: false }} />
            
            <Stack.Screen name="darkmode" options={{ headerShown: false }} /> */}
            <Stack.Screen name="note_view" options={{ headerShown: false }} />
            <Stack.Screen name="note_update" options={{ headerShown: false }} />
            <Stack.Screen name="note_add" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}
