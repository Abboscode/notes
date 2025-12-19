import { Router } from "express";
import { getNotes ,createNotes,getNoteById,deleteNotes,updateNote, } from "../controllers/notesControllers.js";
import { validateNoteMiddlewareOptional,validateNoteMiddlewareStrict } from "../middlewares/validateMiddleware.js"


const router = Router();

// get all notes
router.get("/",getNotes)
 
//get specific note
 router.get("/:id",getNoteById)

//create note
 router.post('/create',validateNoteMiddlewareStrict(["title","content"]),createNotes)

// //update note
router.patch("/update/:id",validateNoteMiddlewareOptional(["title","content"]),updateNote)

// //delete note
router.delete("/delete/:id",deleteNotes)


export default router