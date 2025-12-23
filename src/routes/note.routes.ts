import { Router } from "express";

import {
  searchByKeyword,
  getNotes,
  createNotes,
  getNoteById,
  deleteNotes,
  updateNote,
} from "../controllers/note.controller.js";

import { validateBody } from "../middlewares/validate.middleware.js";

/**
 * Notes Router
 * Handles all /notes routes
 */
const router: Router = Router();

/**
 * @route   GET /notes/search
 * @desc    Search notes by keyword
 * @query   keyword {string}
 * @access  Public
 * * ⚠️ IMPORTANT: This must be defined BEFORE /:id
 * Otherwise "search" will be caught as an :id parameter
 */
router.get("/search", searchByKeyword);

/**
 * @route   GET /notes
 * @desc    Get all notes with pagination
 * @access  Public
 *
 * @route   POST /notes
 * @desc    Create a new note
 * @access  Public
 */
router
  .route("/")
  .get(getNotes)
  .post(
    // strict: true (all fields required)
    validateBody(["title", "content"], { isRequired: true }), 
    createNotes
  );

/**
 * @route   GET /notes/:id
 * @desc    Get a note by ID
 *
 * @route   PATCH /notes/:id
 * @desc    Update a note partially
 *
 * @route   DELETE /notes/:id
 * @desc    Delete a note by ID
 */
router
  .route("/:id")
  .get(getNoteById)
  .patch(
    // strict: false (fields are optional, but if present, must be valid)
    validateBody(["title", "content"], { isRequired: false }), 
    updateNote
  )
  .delete(deleteNotes);

export default router;