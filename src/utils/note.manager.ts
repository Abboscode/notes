import { CANCELLED } from "node:dns";

export class noteManager<T extends number,D> {
    
    cache:Map<T,D>;
    lastId:T;
     private increment:(id:T)=>T
    constructor();
    constructor(lastId?:T,fn?:(id:T)=>T);
    
    constructor(lastId?:T,fn?:(id:T)=>T){
        this.cache=new Map<T,D>();
        this.lastId=lastId??0 as T;
        this.increment=fn??((id:T)=>(id+1) as T)
}


create(data:D):T{
    this.lastId=this.increment(this.lastId)

    this.cache.set(this.lastId,data);
    return this.lastId

}

update(id:T,data:D):boolean{
    if(!this.cache.has(id)) return false
    
    this.cache.set(id,data)
    return true

}


}


