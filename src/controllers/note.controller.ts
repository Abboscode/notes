import { type Response, type Request, type NextFunction } from "express";
import { 
    searchService, 
    createNoteService, 
    deleteNoteService, 
    getNoteByIdService, 
    updateNoteService, 
    getNotesByPaginationService 
} from "../services/note.service.js";
import type { NoteTable } from "../models/note.js";
import { isIdNumber } from "../utils/utils.js";
import AppError from "../utils/app.error.js";
import { catchAsync } from "../utils/utils.js";


/**
 * Fetch all notes with pagination
 */
export const getNotes =catchAsync (async (req: Request, res: Response, next: NextFunction) => {

        const page = parseInt(req.query.page as string || "1");
        const limit = parseInt(req.query.limit as string || "10");
        
        const data: NoteTable[] | undefined = await getNotesByPaginationService(page, limit);
        
        if (!data) {
            return next(new AppError("Bad response from server: no data fetched for the given queries",400,"No data" )) ;
        }

        return res.status(200).json({
            page: page,
            limit: limit,
            totalNotes: data.length,
            data: data
        });
  
});

/**
 * Create a new note
 */
export const createNotes =catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    
        const { title, content } = req.body;

        if (!title || !content) {
           return next (new AppError("Title and content are required", 400,"Missing fields"))
        }

        const id: number = await createNoteService(title, content) ;

        
    res.status(201).json({
            success: true,
            message: "Note created",
            id: id
        });
   
    
});

/**
 * Delete a note by ID
 */
export const deleteNotes =catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const idStr = req.params.id;

        if (!isIdNumber(idStr)) {
            return next(new AppError("Invalid: ID must be a number", 400,"Invalid ID format"))           
        }

        const id = parseInt(idStr||'-1');
        const deleted: boolean = await deleteNoteService(id);

        if (deleted) {
            return res.status(200).json({ status:true,message: `${idStr} succesfully deleted` , id:idStr});
        } else {
            return next(new AppError(`Delation of ${idStr}  failed`, 404,"Delation fail"))
        }
  
});

/**
 * Get a single note by ID
 */
export const getNoteById = catchAsync((req: Request, res: Response, next: NextFunction) => {

        if (!isIdNumber(req.params.id)) {
            return    next(new AppError(`${req.params} is not valid ID`,400 ,"Invalid ID"));
        }

        const id = parseInt(req.params.id||'-1');
        const note: NoteTable | undefined = getNoteByIdService(id);

        if (!note) {
            return    next(new AppError(`Could not find a note with`,404 ,"Not found"));
        }

        return res.status(200).json(note);
    
});

/**
 * Update an existing note
 */
export const updateNote = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

        if (!isIdNumber(req.params.id)) {
            return   next(new AppError(`Could not find a note with`,404 ,"Not found"));
        }

        const id = Number(req.params.id);
        const note = getNoteByIdService(id);

        if (!note) {
            return    next(new AppError(`Could not find a note with`,404 ,"Not found"));;
        }

        const { title, content } = req.body;

        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;

        const updatedNote = await updateNoteService(id, note);
        
        if (!updatedNote) {
            return    next(new AppError(`Could not find a note with`,404 ,"Not found"));;
        }

        return res.status(200).json( {success: true,message:"Note updated successfully",data:updatedNote});
   
});

/**
 * Search notes by keyword
 */
export const searchByKeyword = catchAsync((req: Request, res: Response, next: NextFunction) => {

        const keyword = req.query.keyword as string;
        const response: NoteTable[] | undefined = searchService(keyword);

        if (response === undefined) {
            return    next(new AppError(`Could not find a note with ${keyword}`,404 ,"Not found"));
        }

        return res.status(200).json({
            success: true,
            keyword: keyword,
            data: response
        });
   
});

// handles all non exisiting routes
export const notMatching=(req:Request,res:Response,next:NextFunction)=>{


next(new AppError(`URL does not match any route ${req.originalUrl}`,404,'fail'))


}