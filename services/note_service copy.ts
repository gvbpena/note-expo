// note_service.ts

import { firestore } from "./firebase"; // Import the Firestore instance
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";

interface Location {
    latitude: number;
    longitude: number;
}

interface NoteData {
    title?: string; // Optional for updates
    content?: string; // Optional for updates
    createdAt?: string; // ISO 8601 date string
    location?: Location | null; // Allow null for updates
    authorId?: string; // Optional for updates
    imageUrls?: string[] | null; // Allow null for updates
}

interface Note {
    id?: string;
    title: string;
    content: string;
    createdAt?: Date;
    location?: Location;
    authorId?: string;
    images: string[];
}

// Function to create a note in Firestore
const createNote = async (data: NoteData, id?: string): Promise<Note> => {
    const noteId = id || doc(collection(firestore, "notes")).id; // Generate new ID if not provided
    const note: Note = {
        id: noteId,
        title: data.title || "",
        content: data.content || "",
        createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
        location: data.location || undefined,
        authorId: data.authorId,
        images: data.imageUrls || [],
    };

    await setDoc(doc(firestore, "notes", noteId), note);
    return note;
};

// Function to get all notes from Firestore
const getAllNoteData = async (): Promise<Note[]> => {
    const notesCollection = collection(firestore, "notes");
    const noteSnapshot = await getDocs(notesCollection);
    const notesList: Note[] = noteSnapshot.docs.map((doc) => {
        const data = doc.data() as Note;
        return { ...data, id: doc.id, createdAt: data.createdAt ? new Date(data.createdAt) : undefined };
    });
    return notesList;
};

// Function to get a specific note from Firestore by ID
const getSpecificNoteDataById = async (id: string): Promise<Note | null> => {
    const noteDoc = await getDoc(doc(firestore, "notes", id));
    if (noteDoc.exists()) {
        const data = noteDoc.data() as Note;
        return { ...data, id: noteDoc.id, createdAt: data.createdAt ? new Date(data.createdAt) : undefined };
    }
    return null; // Return null if the note does not exist
};

// Function to update a note in Firestore
const updateNote = async (id: string, data: NoteData): Promise<void> => {
    const noteRef = doc(firestore, "notes", id);
    await updateDoc(noteRef, {
        ...data, // Spread the data to allow partial updates
    });
};

// Function to delete a note from Firestore
const deleteNote = async (id: string): Promise<void> => {
    const noteRef = doc(firestore, "notes", id);
    await deleteDoc(noteRef);
};

export { createNote, getAllNoteData, getSpecificNoteDataById, updateNote, deleteNote };
