import { Router } from "express";


import {
  searchByKeyword,
  getNotes,
  createNotes,
  getNoteById,
  deleteNotes,
  updateNote,
  notMatching,
} from "../controllers/note.controller.js";

import {
  validateNoteMiddlewareOptional,
  validateNoteMiddlewareStrict,
} from "../middlewares/validate.middleware.js";

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
 */
router.get("/search", searchByKeyword);

/**
 * @route   GET /notes
 * @desc    Get all notes with pagination
 * @query   page {number}
 * @query   limit {number}
 * @access  Public
 *
 * @route   POST /notes
 * @desc    Create a new note
 * @body    title {string}
 * @body    content {string}
 * @access  Public
 */
router
  .route("/")
  .get(getNotes)
  .post(
    validateNoteMiddlewareStrict(["title", "content"]),
    createNotes
  );

/**
 * @route   GET /notes/:id
 * @desc    Get a note by ID
 * @param   id {string}
 *
 * @route   PATCH /notes/:id
 * @desc    Update a note partially
 * @param   id {string}
 * @body    title? {string}
 * @body    content? {string}
 *
 * @route   DELETE /notes/:id
 * @desc    Delete a note by ID
 * @param   id {string}
 */
router
  .route("/:id")
  .get(getNoteById)
  .patch(
    validateNoteMiddlewareOptional(["title", "content"]),
    updateNote
  )
  .delete(deleteNotes);

/**
 * Catch all undefined routes
 */
router.use(notMatching);

export default router;
