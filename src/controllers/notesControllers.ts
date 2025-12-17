import {type Response,type Request,type NextFunction } from "express";
import { getAllNotesService,createNoteService} from "../services/noteServices.js"
import {type Note} from "../models/note.js";
//show all notes
export const getNotes=(req:Request,res:Response,next:NextFunction)=>{
    try {
        
       res.json({notes:getAllNotesService()})


    } catch (error) {
        
        next(error)

    }



}

//create new note

export const createNotes =(req:Request,res:Response,next:NextFunction)=>{

    try {
        
        //valdate data
        const node=req.body;
       const id:number= createNoteService(node)
        if(!id){
            res.status(200).json
        }

    } catch (error) {
        
    }



}
