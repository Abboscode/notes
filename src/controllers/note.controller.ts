// controllers/note.controller.ts
import type { Request, Response, NextFunction } from "express";
import * as Service from "../services/note.service.js"; // Namespace import for cleaner code
import AppError from "../utils/app.error.js";
import { catchAsync } from "../utils/utils.js";
import { isIdNumber } from "../utils/utils.js";

// Helper to validate ID safely
const getIdParam = (req: Request): number => {
    // defaults to empty string if undefined
    const idStr = req.params.id || ''; 

    if (!isIdNumber(idStr)) {
       throw new AppError("Invalid ID format", 400, "Validation Failure");
    }
    
    return parseInt(idStr, 10);
};

export const getNotes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await Service.getNotesByPaginationService(page, limit);

    res.status(200).json({
        status: "success",
        page,
        limit,
        results: data.length,
        data
    });
});

export const createNotes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Validation is handled by middleware before this function
    const { title, content } = req.body;
    
    const id = await Service.createNoteService(title, content);

    res.status(201).json({
        status: "success",
        message: "Note created successfully",
        data:  id
    });
});

export const deleteNotes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = getIdParam(req);
    
    const deleted = await Service.deleteNoteService(id);

    if (!deleted) {
        return next(new AppError(`Note with ID ${id} not found`, 404, "Not Found"));
    }

    res.status(200).json({
        status: "success",
        message: "Note deleted successfully",
        data: null
    });
});

export const getNoteById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = getIdParam(req);
    
    const note = Service.getNoteByIdService(id);

    if (!note) {
        return next(new AppError("Note not found", 404, "Not Found"));
    }

    res.status(200).json({
        status: "success",
        data: note
    });
});

export const updateNote = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = getIdParam(req);
    const { title, content } = req.body;

    const updatedNote = await Service.updateNoteService(id, { title, content });

    res.status(200).json({
        success: "success",
        message: "Note updated successfully",
        data: updatedNote
    });
});

export const searchByKeyword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const keyword = req.query.keyword as string;
    
    if (!keyword) {
        return next(new AppError("Please provide a keyword", 400, "Validation Failure"));
    }

    const results = Service.searchService(keyword);

    res.status(200).json({
        status: "success",
        results: results.length,
        data: results
    });
});