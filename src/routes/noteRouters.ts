import { Router } from "express";
import { 
    searchByKeyword, 
    getNotes, 
    createNotes, 
    getNoteById, 
    deleteNotes, 
    updateNote, 
    notMatching
} from "../controllers/notesControllers.js";
import { 
    validateNoteMiddlewareOptional, 
    validateNoteMiddlewareStrict 
} from "../middlewares/validateMiddleware.js";

const router = Router();



// 1. Search notes (e.g., /notes/search?keyword=test)
router.get('/search', searchByKeyword);

// 2. Get all notes with pagination (e.g., /notes?page=1&limit=10)
router.get("/", getNotes);

// 3. Get specific note by ID
router.get("/:id", getNoteById);

// 4. Create note
router.post(
    '/', // Standard REST: POST to the base collection
    validateNoteMiddlewareStrict(["title", "content"]), 
    createNotes
);

// 5. Update note
router.patch(
    "/:id", // Standard REST: PATCH to the specific resource ID
    validateNoteMiddlewareOptional(["title", "content"]), 
    updateNote
);

// 6. Delete note
router.delete("/:id", deleteNotes);

// Use '*' or a string path to catch all undefined routes
//router.use(notMatching);

export default router;