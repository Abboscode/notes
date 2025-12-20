import { type Response, type Request, type NextFunction } from "express";
import { searchService,getAllNotesService, createNoteService, deleteNoteService, getNoteByIdService, updateNoteService, getNotesByPaginationService } from "../services/noteServices.js"
import type { NoteTable } from "../models/note.js";
import { findById, isIdNumber } from "../utils.js";
const INVALID_ID_MESSAGE = { message: "Invalid ID" }
const NOT_FOUND = { message: "Note not found" }

//show all notes
export const getNotes = (req: Request, res: Response, next: NextFunction) => {
    try {

        const page = parseInt(req.query.page as string || "1");
        const limit=parseInt(req.query.limit as string||"10")
        const data:NoteTable[]|undefined=getNotesByPaginationService(page,limit)
        if(!data){
            return res.status(400).json({message:"Bad respones from server no data has been fetched by given queres"})
        }
        
        
        res.status(200).json({
            page:page,
            limit:limit,
            totalNotes:data.length,
            data:data

        })

        console.log("notes fetched successfully")

    } catch (error) {
        next(error)
    }



}

//create new note

export const createNotes = (req: Request, res: Response, next: NextFunction) => {

    try {


        const { title, content } = req.body;

        //validation data in middleware
      

    

        const id: number = createNoteService(title, content)

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

            return res.status(400).json(INVALID_ID_MESSAGE);

        }

        if (isNaN(id)) {

            return res.status(422).json()

        }

        const deleted: boolean = deleteNoteService(id)

    } catch (error) {

        next(error)
    }
}

//get the note by id
export const getNoteById = (req: Request, res: Response, next: NextFunction) => {


    //va;idate request data
    try {
        if (!isIdNumber(req.params.id)) {
            return res.status(400).json(INVALID_ID_MESSAGE)


        }
        const id: number = parseInt(req.params.id || "")


        const note: NoteTable | undefined = getNoteByIdService(id);
        if (!note) return res.status(404).json(NOT_FOUND)

        res.json(note)

    } catch (error) {
        next(error)
    }
}


export const updateNote = (req: Request, res: Response, next: NextFunction) => {

    try {
        console.log(req.params.id)
        console.log("Headers:", req.headers['content-type']); // Should be application/json
        console.log("Body:", req.body);

        if (!isIdNumber(req.params.id)) return res.status(400).json(INVALID_ID_MESSAGE)
        const id = Number(req.params.id)
        const note = getNoteByIdService(id)

        if (note === undefined) return res.status(404).json(NOT_FOUND)

        console.log(req.body)
        const title = req.body.title;
        const content = req.body.content;

        if (title !== undefined) note.title = title
        if (content !== undefined) note.content = content

        const updatedNote: NoteTable | undefined = updateNoteService(id, note)//applies all neccassary info changes too
        if (updatedNote === undefined) return res.status(400).json(NOT_FOUND)
        

        res.status(200).json(updatedNote)




    } catch (error) {
        next(error)
    }

    //validate request data

}

export const searchByKeyword=(req: Request, res: Response, next:NextFunction)=>{
console.log("inside searchKeyword")
    const keyword=req.query.keyword as string;
    
    const respones:NoteTable[]|undefined=searchService(keyword);
    console.log(respones)
    if(respones===undefined) return res.status(400).json(NOT_FOUND)
        
        res.status(200).json({success:true,keyword:keyword,data:respones})





}
