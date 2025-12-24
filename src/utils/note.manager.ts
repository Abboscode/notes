export class noteManager<T extends number, D> {

    private cache: Map<T, D>;
    private lastId: T;
    private increment: (id: T) => T
    constructor();
    constructor(lastId?: T, fn?: (id: T) => T);

    constructor(lastId?: T, fn?: (id: T) => T) {
        this.cache = new Map<T, D>();
        this.lastId = lastId ?? 0 as T;
        this.increment = fn ?? ((id: T) => (id + 1) as T)
    }

    loadData(data: Map<T, D>) {
        this.cache = data
        //SET LAST ID FROM LOADED DATA
        this.lastId = data.keys().toArray().pop() as T


    }
    create(data: D): T {
        this.lastId = this.increment(this.lastId)
        
        this.cache.set(this.lastId, data);
        return this.lastId

    }
    delete(id: T): boolean {
        if (!this.cache.has(id)) return false
        const data: D | null = this.cache.get(id) ?? null
        if (!data) return false
        this.cache.delete(id);
        return true


    }

    update(id: T, data: D): boolean {
        if (!this.cache.has(id)) return false

        this.cache.set(id, data)
        return true;


    }
    getAll(): D[] {
        return Array.from(this.cache.values())


    }

    get(id: T): D | null {


        return this.cache.get(id) || null



    }
    getLastKey(): T {


        return this.lastId;
    }

    offloadData(): D[] {
        return Array.from(this.cache.values())
    }
}