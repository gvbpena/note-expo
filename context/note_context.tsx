// // NoteContext.tsx

// import React, { createContext, useContext, useState, useCallback } from "react";
// import { getAllNotes } from "../services/note_service";

// export interface Note {
//     id: string;
//     title: string;
//     createdAt: string; // Ensure this matches the expected type
// }

// interface NoteContextType {
//     notes: Note[];
//     loading: boolean;
//     error: string | null;
//     fetchNotes: () => Promise<void>;
// }

// const NoteContext = createContext<NoteContextType | undefined>(undefined);

// export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [notes, setNotes] = useState<Note[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);

//     const fetchNotes = async () => {
//         setLoading(true);
//         try {
//             const notesData = await getAllNotes();
//             setNotes(notesData);
//             setError(null);
//         } catch (error) {
//             setError("Failed to fetch notes. Please try again.");
//             console.error("Failed to fetch notes: ", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return <NoteContext.Provider value={{ notes, loading, error, fetchNotes }}>{children}</NoteContext.Provider>;
// };

// export const useNotes = () => {
//     const context = useContext(NoteContext);
//     if (!context) {
//         throw new Error("useNotes must be used within a NoteProvider");
//     }
//     return context;
// };
