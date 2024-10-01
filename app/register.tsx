// app/register.tsx
import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { registerUser } from "../services/auth_service"; // Import the registerUser function
import { useRouter } from "expo-router";

export default function RegisterScreen() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const router = useRouter();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await registerUser(email, password, name);
            router.push("/home");
        } catch (error: any) {
            setError(error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} placeholderTextColor="#aaa" />
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
            <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#aaa"
            />
            {loading ? (
                <Pressable style={styles.button} disabled>
                    <ActivityIndicator size="small" color="#ffffff" />
                </Pressable>
            ) : (
                <Pressable style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </Pressable>
            )}
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Text style={styles.link} onPress={() => router.push("/login")}>
                Already have an account? Login
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
    error: {
        color: "red",
        marginTop: 10,
        textAlign: "center",
    },
});
