import { promises } from "fs";
import {promises as  fs}  from 'fs';
import type { NoteTable } from "../models/note.js";
import { noteManager } from "../utils/note.manager.js";
import { InverseIndex } from "../utils/search.inverse.index.js";

import AppError from "../utils/app.error.js";
import { catchAsync, isIdNumber } from "../utils/utils.js";

const FILE_PATH = 'DATA_TEST.json';

/**
 * Helper to try catch from the JSON file
 */



/**
 * Helper to read notes from the JSON file
 */
const readDB =async ():Promise< NoteTable[]> => {
   
        const data = await promises.readFile(FILE_PATH,'utf8')
     
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

/**
 * Convert to map
 * 
 * 
 */

const toMap = (currentNotes: NoteTable[]):Map<number, NoteTable> =>{

    const mapNotes=new Map<number,NoteTable>()
        currentNotes.forEach(note=>{mapNotes.set(note.id, {...note} )})
    return mapNotes;

}
/**
 * cache manager
 */
const noteCacheManager= new noteManager<number,NoteTable>()
noteCacheManager.loadData(await readDB().then(data=>toMap(data)))

//get last key 

//fast search with reverse index
const data= await readDB()

const searchFormat= new Map<number,string>();

data.forEach(d=>{

searchFormat.set(d.id,d.content)


})
/**
 * index search vert fast
 */
const searchInversIndex=new InverseIndex()
searchInversIndex.buildIndex(searchFormat)




// Initial data load
//let noteCache: Map<number,NoteTable>= await readDB().then(data=>toMap(data))


export const createNoteService = async (title: string, content: string):Promise<number> => {
  
    try{    
        const newNote: NoteTable = {
            id:0,
            title,
            content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        const lastNote=noteCacheManager.create(newNote)

        //UPDATE DATABASE WE NEED TO MAKE IT WAIT SEVERAL MINUTES BEFORE WRITING TO DB SINCE USER MAY CHANGE OPINION
        writeDB(noteCacheManager.offloadData());
        return lastNote;
}catch(err){
throw new AppError("Can not create note ",500,"error in service")




}
      
        
    
};

export const getAllNotesService =async ():Promise<NoteTable[]> => {
        return await readDB() // WE NEED TO READ FROM DB SINCE WE NEED ALL DATA CACHE MAY NOT STORE ALL DATA SINCE IT IS SMALLAR SIZE
};

export const deleteNoteService = async(id: number): Promise<boolean> => {
    try {
       const isDeleted:boolean = noteCacheManager.delete(id);

        
      if(!isDeleted){
        return isDeleted
      }

       await writeDB(noteCacheManager.offloadData());
      
        return isDeleted;
    } catch (error) {
        throw new AppError("Can not delete note ",500,"error in service");
    }
};

export const getNoteByIdService = (id: number): NoteTable | boolean => {
    // We can use the local cache for reads to be faster
    return noteCacheManager.get(id)?? false
};

export const updateNoteService = async(id: number, modifiedData: Partial<NoteTable>):Promise< NoteTable>  => {
    
      



        try{

        const updatedData:NoteTable = {id:id,
                    ...modifiedData,
            updated_at: new Date().toISOString()
        } as NoteTable;


        const isUpdated= noteCacheManager.update(id, updatedData);
        if(!isUpdated)   throw new AppError(`Note with id ${id} not found`,404,"Invalid ID");

        
         writeDB(noteCacheManager.offloadData());
     

        return noteCacheManager.get(id) as NoteTable;
    }catch(err){
        throw err
    }
};

export const getNotesByPaginationService = async(page: number, limit: number):Promise< NoteTable[]> => {
    try {
       const notes=await readDB() as NoteTable[]; // Read from the local cache or database)
        const skip = (page - 1) * limit;
        return notes.slice(skip, skip + limit) as NoteTable[] ; 
    } catch (err) {
        console.error("Pagination Error:", err);
        throw err;
    }
};

export const searchService = (keyword: string): NoteTable[] | undefined => {
    if (!keyword) return undefined;
   
    
    const ids:Set<number>=searchInversIndex.find(keyword);

    return ids ? Array.from(ids).map(id => noteCacheManager.get(id) as NoteTable) : undefined;



};