import { type Response, type Request, type NextFunction } from "express";
import { getAllNotesService, createNoteService, deleteNoteService, getNoteByIdService } from "../services/noteServices.js"
import type { NoteTable } from "../models/note.js";
import { findById ,isIdNumber} from "../utils.js";


//show all notes
export const getNotes = (req: Request, res: Response, next: NextFunction) => {
    try {
        
        res.json(getAllNotesService())
        
        console.log("notes fetched successfully")
    
    } catch (error) {
        
        next(error)
    }



}

//create new note

export const createNotes = (req: Request, res: Response, next: NextFunction) => {

    try {

        //valdate data
        const { title, content } = req.body ;
        const id: number = createNoteService(title,content)
        
        // Basic check to see if body is coming through
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        res.status(201).json({ success: true, message: "note created", id })


    } catch (error) {
        console.log("Cannot create note. Please try")
        next(error)
    }



}

export const deleteNotes = (req: Request, res: Response, next: NextFunction) => {

    try {

        const id: number = parseInt(req.params.id ?? "")
        
        if (!id) {

          return  res.status(400).json({ message: "ID is required" });

        }

        if (isNaN(id)) {

           return res.status(422).json({ message: "Invalid ID"})

        }

        const deleted:boolean = deleteNoteService(id)

    } catch (error) {

        next(error)
    }
}

//get the note by id
export const getNoteById = (req: Request, res: Response, next:NextFunction)=>{


    //va;idate request data
   try{ 
    if(!isIdNumber(req.params.id)) {
       return  res.status(400).json({message:"Invalid ID"})

    
    }
    const id:number = parseInt(req.params.id||"")


const note:NoteTable|JSON = getNoteByIdService(id);

res.json(note)

   }catch(error){
    next(error)
   }
}


