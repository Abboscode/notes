import { Router } from "express";
import { getNotes ,createNotes,getNoteById,deleteNotes} from "../controllers/notesControllers.js";



const router = Router();

// get all notes
router.get("/",getNotes)
 
//get specific note
 router.get("/:id",getNoteById)

//create note
 router.post('/create',createNotes)

// //update note
// router.put("/update/:id")

// //delete note
router.delete("/delete/:id",deleteNotes)

export default router