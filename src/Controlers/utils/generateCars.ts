export const generateCar = () =>{
    const model = ['Tesla', 'BMW', 'Audi', 'Ford', 'Honda', 'Hyundai','Kia','Lada','Mazda']
    const  name = ['Granta','Vesta','Rio','Creta','Niva','Solaris','Largus','Duster','Rapid']
    const modelRandom = Math.floor (9*Math.random()) 
    const nameRandom = Math.floor (9*Math.random())

    const carName = `${model[modelRandom]} ${name[nameRandom]}`
    const color = '#' + Math.floor(Math.random()*16777215).toString(16)
    return ({
        name: carName,
        color: color,
    })
}