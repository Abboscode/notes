import fs from 'fs';
import type { NoteTable } from "../models/note.js";
import { findById } from "../utils.js";

const FILE_PATH = 'DATA_TEST.json';

/**
 * Helper to read notes from the JSON file
 */
const readDB = (): NoteTable[] => {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading database:", error);
        return [];
    }
};

/**
 * Helper to write notes to the JSON file
 */
const writeDB = (data: NoteTable[]): void => {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing to database:", error);
        throw new Error("Disk Write Error");
    }
};

// Initial data load
let notes: NoteTable[] = readDB()||[];

export const createNoteService = (title: string, content: string): number => {
    try {
        const currentNotes:NoteTable[] = readDB()||[];
        const lastId = currentNotes.length > 0 ? currentNotes[currentNotes.length - 1]?.id : 0;
        
        const newNote: NoteTable = {
            id: lastId??0  + 1,
            title,
            content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        currentNotes.push(newNote);
        writeDB(currentNotes);
        
        // Update local cache
        notes = currentNotes;
        return newNote.id;
    } catch (error) {
        console.error("Cannot create note.");
        throw error;
    }
};

export const getAllNotesService = (): NoteTable[] => {
    return readDB();
};

export const deleteNoteService = (id: number): boolean => {
    try {
        const currentNotes = readDB();
        const initialLength = currentNotes.length;
        const filteredNotes = currentNotes.filter(note => note.id !== id);

        if (filteredNotes.length === initialLength) {
            return false; // Note wasn't found
        }

        writeDB(filteredNotes);
        notes = filteredNotes; // Sync local cache
        return true;
    } catch (error) {
        throw error;
    }
};

export const getNoteByIdService = (id: number): NoteTable | undefined => {
    // We can use the local cache for reads to be faster
    return notes.find(note => note.id === id);
};

export const updateNoteService = (id: number, modifiedData: Partial<NoteTable>): NoteTable | undefined => {
    try {
        const currentNotes = readDB();
        const index = currentNotes.findIndex(note => note.id === id);

        if (index === -1) return undefined;

        currentNotes[index] = {
            ...currentNotes[index],
            ...modifiedData,
            updated_at: new Date().toISOString()
        } as NoteTable;

        writeDB(currentNotes);
        notes = currentNotes; // Sync local cache
        return notes[index];
    } catch (error) {
        throw error;
    }
};

export const getNotesByPaginationService = (page: number, limit: number): NoteTable[] => {
    try {
        const skip = (page - 1) * limit;
        return notes.slice(skip, skip + limit);
    } catch (err) {
        console.error("Pagination Error:", err);
        throw err;
    }
};

export const searchService = (keyword: string): NoteTable[] | undefined => {
    if (!keyword) return undefined;
    const lowerKeyword = keyword.toLowerCase();
    
    return notes.filter(note => 
        note.content.toLowerCase().includes(lowerKeyword) || 
        note.title.toLowerCase().includes(lowerKeyword)
    );
};