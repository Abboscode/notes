// services/note.service.ts
import { promises as fs } from "fs";
import type { NoteTable } from "../models/note.js";
import { noteManager } from "../utils/note.manager.js";
import { InverseIndex } from "../utils/search.inverse.index.js";
import AppError from "../utils/app.error.js";

const FILE_PATH = 'DATA_TEST.json';

// --- Data Access Helper (Mini-Repository) ---
const readDB = async (): Promise<NoteTable[]> => {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        // If file doesn't exist, return empty array
        return [];
    }
};

const writeDB = async (data: NoteTable[]): Promise<void> => {
    try {
        await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing to database:", error);
        throw new AppError("Database unavailable", 500, "Disk Write Error");
    }
};

// --- Singleton Instances ---

const noteCacheManager = new noteManager<number, NoteTable>();
const searchInverseIndex = new InverseIndex();

// --- Initialization Logic ---
export const initService = async () => {
    const data = await readDB();
    
    // 1. Load Cache
    const mapNotes = new Map<number, NoteTable>();
    data.forEach(note => mapNotes.set(note.id, { ...note }));
    noteCacheManager.loadData(mapNotes);

    // 2. Load Search Index
    const searchFormat = new Map<number, string>();
    data.forEach(d => searchFormat.set(d.id, d.content));
    searchInverseIndex.buildIndex(searchFormat);
    
    console.log("Service initialized: Data loaded into Cache and Search Index.");
};

// Auto-init for simplicity in this setup (consider calling this from app.ts instead)
initService();

// --- Services ---

export const createNoteService = async (title: string, content: string): Promise<number> => {
    // 1. Create in Cache
    const newNote: NoteTable = {
        id: noteCacheManager.getLastKey() + 1,
        title,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    const newId = noteCacheManager.create(newNote);
    //2-Add newId to Search Index
    
    searchInverseIndex.add(newId, content); 
    
    // 3. Persist to Disk
    await writeDB(noteCacheManager.offloadData());

    return newId;
};

export const getAllNotesService = async (): Promise<NoteTable[]> => {
    // Return from cache is faster and serves as the "source of truth" since we write-through
    return noteCacheManager.offloadData(); 
};

export const deleteNoteService = async (id: number): Promise<boolean> => {
    const isDeleted = noteCacheManager.delete(id);
    
    if (!isDeleted) return false;

    // Remove from search index (Optional: Requires `remove` method in InverseIndex)
    // searchInverseIndex.remove(id);

    await writeDB(noteCacheManager.offloadData());
    return true;
};

export const getNoteByIdService = (id: number): NoteTable | null => {
    return noteCacheManager.get(id) || null;
};

export const updateNoteService = async (id: number, modifiedData: Partial<NoteTable>): Promise<NoteTable> => {
    const currentNote = noteCacheManager.get(id);
    if (!currentNote) {
        throw new AppError(`Note with id ${id} not found`, 404, "Not found");
    }

    const updatedNote: NoteTable = {
        ...currentNote,
        ...modifiedData,
        updated_at: new Date().toISOString()
    };

    const isUpdated = noteCacheManager.update(id, updatedNote);
    if (!isUpdated) throw new AppError("Update failed internally", 500, "Server Error");

    await writeDB(noteCacheManager.offloadData());

    return updatedNote;
};

export const getNotesByPaginationService = async (page: number, limit: number): Promise<NoteTable[]> => {
    const notes = noteCacheManager.offloadData(); // Get all from memory
    const skip = (page - 1) * limit;
    return notes.slice(skip, skip + limit);
};

export const searchService = (keyword: string): NoteTable[] => {
    if (!keyword) return [];

    const ids: Set<number> | undefined = searchInverseIndex.find(keyword);
    
    if (!ids || ids.size === 0) return [];

    // Map IDs back to full Note objects from the cache
    return Array.from(ids)
        .map(id => noteCacheManager.get(id))
        .filter((note): note is NoteTable => note !== undefined);
};