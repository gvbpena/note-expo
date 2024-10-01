import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyBL0m_DF_sbZe46Kc6Tyd1RNgzcnQR9Mlk",
//     authDomain: "expo-db-f8864.firebaseapp.com",
//     projectId: "expo-db-f8864",
//     storageBucket: "expo-db-f8864.appspot.com",
//     messagingSenderId: "45699491501",
//     appId: "1:45699491501:web:8a32b9fda2d8ac78248824",
//     measurementId: "G-FE51J5VY99",
// };
const firebaseConfig = {
    apiKey: "AIzaSyCzVh6Bjm9GsMCtg-ItlNr7OJgbGjdKmKY",
    authDomain: "expo-notemap.firebaseapp.com",
    projectId: "expo-notemap",
    storageBucket: "expo-notemap.appspot.com",
    messagingSenderId: "587791064915",
    appId: "1:587791064915:web:0d404b423b5c148e3f0ba6",
    measurementId: "G-VZ4ES01XSH",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage, app };
