export const addCar = (name:string, color:string, Base:any) => {
    const number = Base.length
    console.log(number+1)
    Base.push({
        id: number+1,
        name: name,
        color: color,
        bestTime: '',
    })
}