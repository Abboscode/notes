import { error } from "node:console";
import type {  NoteTable , Note} from "../models/note.js";

const testNote:NoteTable={
    id:1,
    note:{title:"test",content:"test"},
    created_at:1,
    updated_at:1
}
const notes : NoteTable[]=[testNote];
let id:number=1; 
export const createNoteService = (note: Note)=>{
//validate the model

try {
    
const newNote:NoteTable={
id:id++,
note:note,
created_at:Date.now(),
updated_at:Date.now()


}
//save and send id as validation
notes.push(newNote);
return newNote.id;


} catch (error) {
    console.log("Cannot create note. Please try again later.")
    throw error
}



}

export const  getAllNotesService=():NoteTable[]=>{
    
try {
    
const allNotes = notes
return allNotes;

} catch (error){
    console.log("Cannot get notes. Please try again")
    throw error


}
    


}



