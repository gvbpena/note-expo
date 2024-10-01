import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
    apiKey: "AIzaSyCzVh6Bjm9GsMCtg-ItlNr7OJgbGjdKmKY",
    authDomain: "expo-notemap.firebaseapp.com",
    projectId: "expo-notemap",
    storageBucket: "expo-notemap.appspot.com",
    messagingSenderId: "587791064915",
    appId: "1:587791064915:web:0d404b423b5c148e3f0ba6",
    measurementId: "G-VZ4ES01XSH",
};

const app = initializeApp(firebaseConfig);

let auth;
if (Platform.OS === "android") {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
}
if (Platform.OS === "web") {
    auth = getAuth(app);
}

const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage, app };
