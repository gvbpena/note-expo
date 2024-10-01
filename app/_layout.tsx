import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="(home)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="account" options={{ headerShown: false }} />
            
            <Stack.Screen name="darkmode" options={{ headerShown: false }} /> */}
            <Stack.Screen name="item" options={{ headerShown: false }} />
            {/* <Stack.Screen name="note/update" options={{ headerShown: false }} /> */}
            <Stack.Screen name="note" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}
