import { error } from "node:console";
import type {  NoteTable } from "../models/note.js";
import { findById } from "../utils.js";
import { nextTick } from "node:process";
import { json } from "node:stream/consumers";
import { findPackageJSON } from "node:module";

const testNote:NoteTable={
    id:1,
    title:"test"    ,content:"test",
    created_at:1,
    updated_at:1
}
let notes : NoteTable[]=[testNote];
let id:number=1; 
export const createNoteService = (title:string,content:string):number=>{
//validate the model

try {
    
const newNote:NoteTable={
id:id++,
title:title,
content:content,
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
    

return notes;

} catch (error){
    console.log("Cannot get notes. Please try again")
    throw error


}
    


}

export const deleteNoteService = (id: number): boolean => {


try {
    

const note:NoteTable | undefined = findById(id,notes);

if(!note){
    return false;
}

notes= notes.filter(note=>note.id!==id)

return true;





} catch (error) {
    throw error
}


}

export  const getNoteByIdService=(id:number):NoteTable|undefined=>{

/** 
@param {id} - the id of the note to retrieve
@returns {NoteTable} or @returns {Json} error message
*/
    const note= findById(id,notes);
    if(note!==undefined){
        return note
    }
    
    
    return undefined;




}


export const updateNoteService=(id:number,modifiedNote:NoteTable):NoteTable|undefined=>{

modifiedNote.updated_at=Date.now();

const index=notes.findIndex(note=>note.id===id);
console.log("Index",index)


if(index===-1) return undefined;

notes[index]=modifiedNote;
return notes[index];



}
