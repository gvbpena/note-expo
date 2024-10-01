import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { firestore, auth } from "./firebase"; // Import firestore from firebase.ts
import { doc, setDoc, getDoc } from "firebase/firestore";

// Sign up a new user and create a profile in Firestore
const registerUser = async (email: string, password: string, name: string) => {
    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(firestore, "users", user.uid), {
            id: user.uid,
            name,
            email,
        });
        return user;
    } catch (error) {
        return handleError(error);
    }
};

// Sign in an existing user
const loginUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        return handleError(error);
    }
};

// Log out the current user
const logoutUser = async () => {
    try {
        await signOut(auth);
        return true;
    } catch (error) {
        return handleError(error);
    }
};

// Observe user state changes
const observeAuthState = (callback: (user: FirebaseUser | null) => void) => {
    onAuthStateChanged(auth, (user: FirebaseUser | null) => {
        callback(user);
    });
};

// Get the current user's profile from Firestore
const getUserProfile = async (userId: string) => {
    try {
        const userDoc = await getDoc(doc(firestore, "users", userId));
        if (userDoc.exists()) {
            return { id: userDoc.data()?.id, ...userDoc.data() };
        } else {
            throw new Error("No such user profile!");
        }
    } catch (error) {
        return handleError(error);
    }
};

// Error handling function
const handleError = (error: any) => {
    return { errorCode: error.code, errorMessage: error.message };
};

export { registerUser, loginUser, logoutUser, observeAuthState, getUserProfile };
