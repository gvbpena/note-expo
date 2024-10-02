import { firestore } from "./firebase"; // Ensure this path is correct
import { collection, doc, setDoc, updateDoc, getDoc, getDocs, deleteDoc, query, where } from "firebase/firestore";
import { auth } from "./firebase"; // Add this line to import auth

export interface Note {
    id?: string;
    title?: string;
    content?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    imageUrls?: string[];
    createdAt?: string;
    authorId?: string;
}

export const createNote = async (data: any) => {
    try {
        const newNoteRef = doc(collection(firestore, "notes"));
        await setDoc(newNoteRef, data);
        return newNoteRef.id;
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
        const noteRef = doc(firestore, "notes", id);
        await updateDoc(noteRef, data);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Failed to update note: " + error.message);
        } else {
            throw new Error("Failed to update note: An unknown error occurred.");
        }
    }
};

export const getNoteById = async (id: string) => {
    try {
        const noteRef = doc(firestore, "notes", id);
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
// export const getAllNotes = async () => {
//     try {
//         const snapshot = await getDocs(collection(firestore, "notes"));
//         const notes: any[] = [];
//         snapshot.forEach((doc) => {
//             const data = doc.data();
//             notes.push({
//                 id: doc.id,
//                 title: data.title,
//                 content: data.content,
//                 location: data.location,
//                 images: data.images,
//             });
//         });
//         return notes;
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             throw new Error("Failed to fetch notes: " + error.message);
//         } else {
//             throw new Error("Failed to fetch notes: An unknown error occurred.");
//         }
//     }
// };
export const getAllNotes = async () => {
    try {
        const user = auth.currentUser; // Get the currently logged-in user
        if (!user) {
            throw new Error("No user is currently logged in.");
        }

        const notesRef = collection(firestore, "notes");
        const q = query(notesRef, where("authorId", "==", user.uid)); // Filter by authorId = user.uid
        const snapshot = await getDocs(q);

        const notes: any[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            notes.push({
                id: doc.id,
                title: data.title,
                content: data.content,
                location: data.location,
                imageUrls: data.imageUrls,
                createdAt: data.createdAt,
                authorId: data.authorId,
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
        const noteRef = doc(firestore, "notes", id);
        await deleteDoc(noteRef);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Failed to delete note: " + error.message);
        } else {
            throw new Error("Failed to delete note: An unknown error occurred.");
        }
    }
};

export const removeImageFromNote = async (noteId: string, imageUrl: string) => {
    try {
        const noteRef = doc(firestore, "notes", noteId);

        const noteSnap = await getDoc(noteRef);
        if (!noteSnap.exists()) {
            throw new Error("No note found with the given ID.");
        }
        const noteData = noteSnap.data();
        const updatedImageUrls = noteData.imageUrls?.filter((url: string) => url !== imageUrl) || [];

        await updateDoc(noteRef, { imageUrls: updatedImageUrls });
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Failed to remove image from note: " + error.message);
        } else {
            throw new Error("Failed to remove image from note: An unknown error occurred.");
        }
    }
};
