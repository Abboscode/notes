import {type Response,type Request,type NextFunction } from "express";
import { getAllNotesService,createNoteService} from "../services/noteServices.js"
import {type Note} from "../models/note.js";
//show all notes
export const getNotes=(req:Request,res:Response,next:NextFunction)=>{
    try {
        
       res.json({notes:getAllNotesService()})

        console.log("notes fetched successfully")
    } catch (error) {
        
        next(error)

    }



}

//create new note

export const createNotes =(req:Request,res:Response,next:NextFunction)=>{

    try {
        
        //valdate data
      
   const {title,content}=req.body as Note;

      const note:Note={title,content};
      

       const id:number= createNoteService(note)
       // Basic check to see if body is coming through
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        } 
       
       return  res.status(201).json({success:true,message:"note created",id})
       

    } catch (error) {
        console.log("Cannot create note. Please try")
        next(error)
    }



}
