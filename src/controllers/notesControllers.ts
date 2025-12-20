import { type Response, type Request, type NextFunction } from "express";
import { 
    searchService, 
    createNoteService, 
    deleteNoteService, 
    getNoteByIdService, 
    updateNoteService, 
    getNotesByPaginationService 
} from "../services/noteServices.js";
import type { NoteTable } from "../models/note.js";
import { isIdNumber } from "../utils.js";

const INVALID_ID_MESSAGE = { message: "Invalid ID" };
const NOT_FOUND = { message: "Note not found" };

/**
 * Fetch all notes with pagination
 */
export const getNotes = (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string || "1");
        const limit = parseInt(req.query.limit as string || "10");
        
        const data: NoteTable[] | undefined = getNotesByPaginationService(page, limit);
        
        if (!data) {
            return res.status(400).json({ 
                message: "Bad response from server: no data fetched for the given queries" 
            });
        }

        return res.status(200).json({
            page: page,
            limit: limit,
            totalNotes: data.length,
            data: data
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new note
 */
export const createNotes = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        const id: number = createNoteService(title, content);
        
        return res.status(201).json({
            success: true,
            message: "Note created",
            id: id
        });
    } catch (error) {
        console.error("Cannot create note:", error);
        next(error);
    }
};

/**
 * Delete a note by ID
 */
export const deleteNotes = (req: Request, res: Response, next: NextFunction) => {
    try {
        const idStr = req.params.id;

        if (!isIdNumber(idStr)) {
            return res.status(400).json(INVALID_ID_MESSAGE);
        }

        const id = parseInt(idStr||'-1');
        const deleted: boolean = deleteNoteService(id);

        if (deleted) {
            return res.status(200).json({ message: "Successfully deleted" });
        } else {
            return res.status(404).json(NOT_FOUND);
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Get a single note by ID
 */
export const getNoteById = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!isIdNumber(req.params.id)) {
            return res.status(400).json(INVALID_ID_MESSAGE);
        }

        const id = parseInt(req.params.id||'-1');
        const note: NoteTable | undefined = getNoteByIdService(id);

        if (!note) {
            return res.status(404).json(NOT_FOUND);
        }

        return res.json(note);
    } catch (error) {
        next(error);
    }
};

/**
 * Update an existing note
 */
export const updateNote = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!isIdNumber(req.params.id)) {
            return res.status(400).json(INVALID_ID_MESSAGE);
        }

        const id = Number(req.params.id);
        const note = getNoteByIdService(id);

        if (!note) {
            return res.status(404).json(NOT_FOUND);
        }

        const { title, content } = req.body;

        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;

        const updatedNote = updateNoteService(id, note);
        
        if (!updatedNote) {
            return res.status(404).json(NOT_FOUND);
        }

        return res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
};

/**
 * Search notes by keyword
 */
export const searchByKeyword = (req: Request, res: Response, next: NextFunction) => {
    try {
        const keyword = req.query.keyword as string;
        const response: NoteTable[] | undefined = searchService(keyword);

        if (response === undefined) {
            return res.status(404).json(NOT_FOUND);
        }

        return res.status(200).json({
            success: true,
            keyword: keyword,
            data: response
        });
    } catch (error) {
        next(error);
    }
};