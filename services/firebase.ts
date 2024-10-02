import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
    apiKey: "AIzaSyCjM46cN2b9oHQK1RYGefgdeVducx-ijP8",
    authDomain: "notemap-db.firebaseapp.com",
    projectId: "notemap-db",
    storageBucket: "notemap-db.appspot.com",
    messagingSenderId: "542263575364",
    appId: "1:542263575364:web:abe2389cbdbbdb91418d11",
};

const app = initializeApp(firebaseConfig);

// let auth;
// if (Platform.OS === "android") {
//     auth = initializeAuth(app, {
//         persistence: getReactNativePersistence(ReactNativeAsyncStorage),
//     });
// }
// if (Platform.OS === "web") {
//     auth = getAuth(app);
// }
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const firestore = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

// const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage, app };
