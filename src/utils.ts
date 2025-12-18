import type{  NoteTable } from './models/note.js';


export const findById  =(id: number, notes: NoteTable[]):NoteTable|undefined =>{

return notes.find(note=>note.id===id)




}

export const isIdNumber = (id: string|undefined): boolean =>{

    if (id===undefined) return false;
    const thisId:number=parseInt(id||'-1');

 if(isNaN(thisId)) return false; //checks if a number is not a number

 if(thisId<0) return false; //check for postitive bnumber

return true;


}