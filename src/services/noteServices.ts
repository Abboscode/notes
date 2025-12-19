import { error } from "node:console";
import type {  NoteTable } from "../models/note.js";
import { findById } from "../utils.js";
import fs from 'fs'


const jsonData: any[] = JSON.parse(fs.readFileSync('DATA.json','utf8'))
// const testNote:NoteTable={
//     id:1,
//     title:"test"    ,content:"test",
//     created_at:1,
//     updated_at:1
// }
// console.log(jsonData[0])
let notes : NoteTable[]=[];
for (let i = 0; i < jsonData.length;i++){
const data=jsonData[i]||undefined
if(data){
// console.log(data.title)
const id:number=data.id
const title:string=data.title
const content:string=data.content
const created_at:string=data.created_at
const updated_at:string=data.updated_at

const note:NoteTable={id:id,title:title,
content:content,
created_at:created_at,
updated_at:updated_at}
notes.push(note)
}


}
//console.log(notes)





let id=16
export const createNoteService = (title:string,content:string):number=>{
//validate the model
const newNote={
id:id++,
title:title,
content:content,
created_at:Date.now().toString(),
updated_at:Date.now().toLocaleString()


}
try {
    

//save and send id as validation
const notes=JSON.parse(fs.readFileSync('DATA.json','utf8'))
const id:number=notes[notes.length-1].id+1
newNote.id=id
notes.push(newNote)
fs.writeFileSync('DATA.json',JSON.stringify(notes,null,2))





} catch (error) {
    console.log("Cannot create note. Please try again later.")
    throw error
}

return newNote.id

}

export const  getAllNotesService=():NoteTable[]=>{
    
try {
    

return JSON.parse(fs.readFileSync('DATA.json','utf8') )as NoteTable[];


} catch (error){
    console.log("Cannot get notes. Please try again")
    throw error


}
    


}

export const deleteNoteService = (id: number): boolean => {


try {
    

const note:NoteTable|undefined = findById(id,notes);


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

modifiedNote.updated_at=Date.now().toString();

const index=notes.findIndex(note=>note.id===id);
console.log("Index",index)


if(index===-1) return undefined;

notes[index]=modifiedNote;
return notes[index];



}
