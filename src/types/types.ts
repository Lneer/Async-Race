 export type Car = {
    name:string,
    color:string,
    id:number
}

export type Winner = {
    id:number,
    wins:number,
    time: number,
}

export type Cars = {
    item:Car[],
    count:number
}

export type Winners = {
    items: Winner[],
    count: number,
}
export type EngineParameters = {
    velocity:number,
    distance: number

}