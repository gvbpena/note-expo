// // context/NoteContext.tsx
// import React, { createContext, useContext, useState } from "react";

// interface NoteContextType {
//     noteData: any; // Adjust the type according to your note structure
//     setNoteData: React.Dispatch<React.SetStateAction<any>>;
// }

// const NoteContext = createContext<NoteContextType | undefined>(undefined);

// export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [noteData, setNoteData] = useState<any>(null);

//     return <NoteContext.Provider value={{ noteData, setNoteData }}>{children}</NoteContext.Provider>;
// };

// export const useNoteContext = () => {
//     const context = useContext(NoteContext);
//     if (!context) {
//         throw new Error("useNoteContext must be used within a NoteProvider");
//     }
//     return context;
// };
