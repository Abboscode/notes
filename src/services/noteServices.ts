
import type {  NoteTable } from "../models/note.js";
import { findById } from "../utils.js";
import fs from 'fs'


const jsonData: any[] = JSON.parse(fs.readFileSync('DATA.json','utf8'))


let notes : NoteTable[]=[];
//format data 
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







export const createNoteService = (title:string,content:string):number=>{
//validate the model
const newNote={
id:0,
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

export const getNotesByPaginationService=(page:number,limit:number):NoteTable[]|undefined=>{
    
    try{
        if(notes.length<limit) {
            return notes;


        }
        const skip:number= (page-1)*limit;

        
        

        const paginatedNotes:NoteTable[]=notes.slice(skip,skip+limit);
        
        return paginatedNotes??undefined;




    }catch(err){
        console.log("Error",err)
        throw err
    }
    
    
    
    }

    export const searchService=(keyword:string):NoteTable[]|undefined=>{

        if(!keyword) return undefined;
    return notes.filter(note=>note.content.toLowerCase().includes(keyword.toLowerCase()))??undefined;

    }