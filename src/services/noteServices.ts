import { promises } from "fs";
import {promises as  fs}  from 'fs';
import type { NoteTable } from "../models/note.js";
import { catchAsync, findById } from "../utils.js";

import AppError from "../models/AppError.js";

const FILE_PATH = 'DATA_TEST.json';

/**
 * Helper to try catch from the JSON file
 */



/**
 * Helper to read notes from the JSON file
 */
const readDB =async ():Promise< NoteTable[]> => {
   
        const data = await promises.readFile(FILE_PATH,'utf8')
        console.log(data)
        return JSON.parse(data);

    
    }
;

/**
 * Helper to write notes to the JSON file
 */
const writeDB = async (data: NoteTable[]):Promise<void> => {
    try {
        fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing to database:", error);
        throw new Error("Disk Write Error");
    }
};

// Initial data load
let notes: NoteTable[] = await readDB()

export const createNoteService = async (title: string, content: string):Promise<number> => {
        console.log("inisde createNodeService")
        const currentNotes:NoteTable[] = await readDB();
       
        const lastId = currentNotes.length > 0 ? currentNotes[currentNotes.length - 1]?.id : 0;
        const newId=(lastId??0 )+1
        const newNote: NoteTable = {
            id: newId,
            title,
            content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        currentNotes.push(newNote);
        writeDB(currentNotes);
        
        // Update local cache
        notes = currentNotes;
        return newId;
  
      
        
    
};

export const getAllNotesService =async ():Promise<NoteTable[]> => {
    const data:NoteTable[] = await readDB() as NoteTable[]
    return data
};

export const deleteNoteService = async(id: number): Promise<boolean> => {
    try {
        const currentNotes = await readDB();
        const initialLength = currentNotes.length;
        const filteredNotes = currentNotes.filter(note => note.id !== id);

        if (filteredNotes.length === initialLength) {
            return false; // Note wasn't found
        }

       await writeDB(filteredNotes);
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

export const updateNoteService = async(id: number, modifiedData: Partial<NoteTable>):Promise< NoteTable>  => {
    
        const currentNotes = await readDB();
        const index = currentNotes.findIndex(note=> note.id===id)


        if (index === -1) throw new AppError(`Note with id ${id} not found`,404,"Invalid ID");


        currentNotes[index] = {
            ...currentNotes[index],
            ...modifiedData,
            updated_at: new Date().toISOString()
        } as NoteTable;

        writeDB(currentNotes);
        notes = currentNotes; // Sync local cache

        return currentNotes[index];
   
};

export const getNotesByPaginationService = async(page: number, limit: number):Promise< NoteTable[]> => {
    try {
        notes=await readDB() as NoteTable[]; // Read from the local cache or database)
        const skip = (page - 1) * limit;
        return notes.slice(skip, skip + limit) as NoteTable[] ; 
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