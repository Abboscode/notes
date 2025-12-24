

export class  InverseIndex {

private words:Map<string,Set<number>>;
constructor()
constructor(words?:Map<string,Set<number>>){

    this.words=words||new Map<string,Set<number>>()
}

buildIndex(notes: Map<number, string>) {
    
    
    
    for (const [id, content] of notes.entries()) {
    
        if (!content || typeof content !== 'string') {
            console.warn(`Skipping note ${id}: Content is missing or invalid.`);
            continue; 
        }
        
        const tokens:string[] = content
            .toLowerCase()
            .split(/\s+/) //remove all whitespace with one or more subsequenceoccurences 
            .map(word => word.replace(/[^a-z0-9]/g, '')) //replace any non-alphanumeric characters with nothing 
            .filter(word => word.length > 0); 
        for (const token of tokens) {
           
            if (!this.words.has(token)) {
                this.words.set(token, new Set<number>());
            }

            this.words.get(token)!.add(id);
        }
    }
}


find(query:string):Set<number>{
    return this.words.get(query.toLowerCase().trim())?? new Set<number>()
}
add(id:number,content:string){
     
      
        const tokens = content
            .toLowerCase()
            .split(/\s+/) //remove all whitespace with one or more subsequenceoccurences 
            .map(word => word.replace(/[^a-z0-9]/g, '')) //replace any non-alphanumeric characters with nothing 
            .filter(word => word.length > 0); 
        for (const token of tokens) {
           
            if (!this.words.has(token)) {
                this.words.set(token, new Set<number>());
            }

            this.words.get(token)!.add(id);
        }
    }




}



