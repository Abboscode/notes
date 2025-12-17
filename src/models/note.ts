

export interface Note {
    title: string;
    content: string;
}
export interface NoteTable{
id:number;
note:Note;
updated_at:Date;
created_at:Date
}
