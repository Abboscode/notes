import { Router } from "express";
import { getNotes } from "../controllers/notesControllers";


const router = Router();

// get all notes
router.get("/",getNotes)
 
// //get specific note
// router.get("/:id")

// //create note
// router.post("/create")

// //update note
// router.put("/update/:id")

// //delete note
// router.delete("/delete/:id")

export default router