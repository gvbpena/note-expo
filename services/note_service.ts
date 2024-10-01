import { firestore } from "./firebase"; // Ensure this path is correct
import { collection, doc, setDoc, updateDoc, getDoc, getDocs, deleteDoc } from "firebase/firestore";

export interface Note {
    id?: string;
    title?: string;
    description?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    imageUrls?: string[];
    createdAt?: string;
    authorId?: string;
}
// Create a new note
export const createNote = async (data: any) => {
    try {
        const newNoteRef = doc(collection(firestore, "notes")); // Create a new document reference
        await setDoc(newNoteRef, data); // Set the data for the new document
        return newNoteRef.id; // Return the ID of the newly created note
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Failed to create note: " + error.message);
        } else {
            throw new Error("Failed to create note: An unknown error occurred.");
        }
    }
};

// Update an existing note
export const updateNote = async (id: string, data: any) => {
    try {
        const noteRef = doc(firestore, "notes", id); // Get a reference to the note
        await updateDoc(noteRef, data); // Update the note with new data
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Failed to update note: " + error.message);
        } else {
            throw new Error("Failed to update note: An unknown error occurred.");
        }
    }
};

// Get a specific note by ID
export const getNoteById = async (id: string) => {
    try {
        const noteRef = doc(firestore, "notes", id); // Get a reference to the note
        const docSnap = await getDoc(noteRef); // Get the document snapshot
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() }; // Include the document ID in the returned object
        } else {
            throw new Error("No note found with the given ID.");
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Failed to fetch note data: " + error.message);
        } else {
            throw new Error("Failed to fetch note data: An unknown error occurred.");
        }
    }
};

// Get all notes
export const getAllNotes = async () => {
    try {
        const snapshot = await getDocs(collection(firestore, "notes"));
        const notes: any[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            notes.push({
                id: doc.id,
                title: data.title,
                content: data.content,
                location: data.location,
                images: data.images,
            });
        });
        return notes;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Failed to fetch notes: " + error.message);
        } else {
            throw new Error("Failed to fetch notes: An unknown error occurred.");
        }
    }
};

// Delete a note by ID
export const deleteNote = async (id: string) => {
    try {
        const noteRef = doc(firestore, "notes", id); // Get a reference to the note
        await deleteDoc(noteRef); // Delete the note
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Failed to delete note: " + error.message);
        } else {
            throw new Error("Failed to delete note: An unknown error occurred.");
        }
    }
};
