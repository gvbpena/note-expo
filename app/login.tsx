// app/login.js
import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { loginUser } from "../services/auth_service";
import { useRouter } from "expo-router";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        setError(""); // Clear previous errors
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/home");
        } catch (error: any) {
            setError(error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#aaa"
            />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} placeholderTextColor="#aaa" />
            {loading ? (
                <ActivityIndicator size="large" color="#000" style={styles.loader} />
            ) : (
                <Pressable style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
            )}
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Text style={styles.link} onPress={() => router.push("/register")}>
                Don't have an account? Register
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: "white",
    },
    input: {
        borderWidth: 1,
        borderColor: "#000",
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        color: "#000",
    },
    button: {
        backgroundColor: "#000",
        borderRadius: 8,
        paddingVertical: 15,
        marginBottom: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    link: {
        color: "black",
        marginTop: 10,
        textAlign: "center",
        textDecorationLine: "underline",
    },
    loader: {
        marginBottom: 10,
    },
    error: {
        color: "red",
        marginTop: 10,
        textAlign: "center",
    },
});
