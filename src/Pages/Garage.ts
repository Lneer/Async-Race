import { animation } from "../Controlers/animation";
import { generateCar } from "../Controlers/listenets/generateCars";
import { getCarID } from "../Controlers/listenets/getCarId";
import { listenCreate } from "../Controlers/listenets/listenerCreate";
import { toggleUpdateField } from "../Controlers/listenets/toggleUpdate";
import { EngineHandler, GarageHandler } from "../Controlers/Requests";
import { Layout } from "../View/layout";
import { Render } from "../View/RanderLayout";

const Garage = new GarageHandler('http://127.0.0.1:3000');
const Engine = new EngineHandler('http://127.0.0.1:3000');
const GarageRender = new Render

 const  generateGarage = async(page:number = 1) => {
  const content = document.querySelector('.content-wrapper') as HTMLElement;
  content.innerHTML = ''
  const data = await Garage.getCars(page)
  const carsPerPage = 7;
  const totalPages = data.count ? Math.ceil(+data.count / carsPerPage) : 1
  content.append(GarageRender.renderLayout())
  GarageRender.renderGarage(data)
  GarageRender.renderStatus()
  const submitInputs = (document.querySelector('.car-update') as HTMLDivElement).querySelectorAll('input')
  submitInputs.forEach((elem) => (elem as HTMLInputElement).setAttribute('disabled', 'true'))
  const paginButton = (document.querySelector('.pagination') as HTMLElement)
  // if(page === totalPages && totalPages > 1){
  //   paginButton.firstElementChild?.classList.remove('disabled')
  //   paginButton.lastElementChild?.classList.add('disabled')
  // }
  // if(page === 1 && totalPages > 1){
  //   paginButton.firstElementChild?.classList.add('disabled')
  //   paginButton.lastElementChild?.classList.remove('disabled')
  // }
  // if(page === totalPages && totalPages === 1){
  //   paginButton.firstElementChild?.classList.add('disabled')
  //   paginButton.lastElementChild?.classList.add('disabled')
  // }
  // if(page > 1  && page < totalPages){
  //   paginButton.firstElementChild?.classList.remove('disabled')
  //   paginButton.lastElementChild?.classList.remove('disabled')
  // }
};

export const startGarage = () =>{
  const page = sessionStorage.getItem('page');

  const pageInt = page ? +page : 1 
  generateGarage(pageInt)
  .then(() =>{
    createCarBody()
    deleteCar()
    updateCar()
    generateCars()
    pagination()
    startEngine()
    massStart()
    resetEngine()
  })
}
const  createCarBody = () => {
  let page = sessionStorage.getItem('page') ? +(sessionStorage.getItem('page') as string) : 1
  const createButton = document.querySelector('.submit-create')
  createButton?.addEventListener('click', async(event:Event) => {
    if(listenCreate(event)){
      await Garage.createCar(listenCreate(event) as {name:string, color:string})
    }
    const data = await Garage.getCars(page)
    GarageRender.renderGarage(data)
  })
}

const deleteCar = () => {
  let page = sessionStorage.getItem('page') ? +(sessionStorage.getItem('page') as string) : 1
  const carsInGarage = document.querySelector('#cars-in-garage') as HTMLDivElement
  carsInGarage.addEventListener('click', async(event:Event) => {
    if(getCarID(event, 'Remove')) {
      await Garage.deleteCar(getCarID(event,'Remove') as number)
      const data = await Garage.getCars(page)
      GarageRender.renderGarage(data)
    }
  })
}
const updateCar = () => {
  const carsInGarage = document.querySelector('#cars-in-garage') as HTMLDivElement
  let id:number = 0;
  let updateStatus:boolean = false;
  let car:any 
  carsInGarage.addEventListener('click', async(event:Event) => {
    if(!updateStatus){
      id = getCarID(event, 'Select') as number
      if(id){
        car = await Garage.getCar(id as number)
        toggleUpdateField();
        (document.querySelector('.name-update') as HTMLInputElement).value = car.name;
        (document.querySelector('.color-update') as HTMLInputElement).value = car.color;
        updateStatus = true;
      }
    }
  }) 
  const submitHandler = async(event:Event) => {
    let page = sessionStorage.getItem('page') ? +(sessionStorage.getItem('page') as string) : 1
    await Garage.updateCar(Number(id),listenCreate(event, 'update') as {name:string, color:string} )
    const data = await Garage.getCars(page)
    GarageRender.renderGarage(data)
    toggleUpdateField();
    updateStatus = false;
    id = 0;
    (document.querySelector('.name-update') as HTMLInputElement).value = '';
    (document.querySelector('.color-update') as HTMLInputElement).value = '';  
  }

  const updateButton = document.querySelector('.submit-update') as HTMLDivElement
  updateButton.addEventListener('click', submitHandler)
}

const generateCars  = () =>{
  let page = sessionStorage.getItem('page') ? +(sessionStorage.getItem('page') as string) : 1
  const generateButton = document.querySelector('#generate-car')
  generateButton?.addEventListener('click', async() => {
    for(let i = 0; i<100; i++){
      const car = generateCar()
      await Garage.createCar(car)
    }
    const data = await Garage.getCars(page)
     GarageRender.renderGarage(data)
  })
}

const pagination = () => {
  const carsPerPage = 7;
  const paginationBody = document.querySelector('.pagination')
   paginationBody?.addEventListener('click', async(event:Event) =>{
    let page = sessionStorage.getItem('page') ? +(sessionStorage.getItem('page') as string) : 1
    if((event.target as HTMLLIElement).classList.contains('prev')){
      page = page===1? 1: page - 1
    }
    if((event.target as HTMLLIElement).classList.contains('next')){
  
      const data = await Garage.getCars(page)
      const totalPages = data.count ? Math.ceil(+data.count / carsPerPage) : 1
      console.log('next')
      page = page === totalPages ? totalPages : page+1
    }
    sessionStorage.setItem('page',`${page}`)
    const data = await Garage.getCars(page)
    GarageRender.renderGarage(data)
   })

}

const startEngine = () => {
  const carsInGarage = document.querySelector('#cars-in-garage') as HTMLDivElement
  carsInGarage.addEventListener('click', async(event) => {
    const carDiv = (event.target as HTMLButtonElement).closest('.car') as HTMLDivElement;
    const id = getCarID(event, 'start') as number
    const egineParam = await Engine.startEngine(id)
    let car = carDiv.querySelector('svg') as SVGElement
    const carAnimation = animation(car,egineParam.distance, egineParam.velocity)
    carAnimation.play()
    try {
      const engineResponse = await Engine.drive(id)
      if(engineResponse.status === 500) throw new Error('500 error')
    } catch  {
        carAnimation.pause()
      }
  })
}

const resetEngine =() => {
  const carsInGarage = document.querySelector('#cars-in-garage') as HTMLDivElement
  carsInGarage.addEventListener('click', async(event) => {
    const carDiv = (event.target as HTMLButtonElement).closest('.car') as HTMLDivElement;
    const id = getCarID(event, 'reset') as number
    const egineParam = await Engine.stopEngine(id)
    document.getAnimations().forEach((elem) => elem.cancel())
    const statusField = document.querySelector('#statusField') as HTMLDivElement;

    const startButton = carDiv.querySelector('.btn-outline-primary') as HTMLButtonElement;
    const resetButton = carDiv.querySelector('.btn-outline-warning') as HTMLButtonElement;

    const startAllButton = statusField.querySelector('.btn-primary') as HTMLButtonElement;
    const resetAllButton = statusField.querySelector('.btn-secondary') as HTMLButtonElement;
    const buttonSet: HTMLButtonElement[] = [startButton,resetButton,startAllButton,resetAllButton]
    buttonSet.forEach((elem) => elem.toggleAttribute('disabled'))
  })
}
const massStart =  () => {
  const statusField = document.querySelector('#statusField');
  const carList = document.querySelectorAll('.car') as NodeList;
  statusField?.addEventListener ('click', async (event:Event) => {
    if((event.target as HTMLButtonElement).innerText === 'start All') {
      let engineParametrs:any = [];
      const promises:any = [];
      const animationArr:Animation[] =[];
      const winners:any = []
      carList.forEach((elem, index) => {
        const id = ((carList[index] as HTMLDivElement).getAttribute('id') as  string).slice(4)
        promises.push( Engine.startEngine(Number(id)))
      })
      engineParametrs = await Promise.all(promises)
      console.log(engineParametrs);
      
      carList.forEach(async(elem, index) => {
        let car = (elem as HTMLDivElement).querySelector('svg') as SVGElement;
        const anim =  animation(car,engineParametrs[index].distance,engineParametrs[index].velocity);
        anim.id = `${index}`;
        // ((carList[index] as HTMLDivElement).getAttribute('id') as  string).slice(4)
        animationArr.push(anim)
      })
      carList.forEach(async(elem,index) => {
        const id = ((elem as HTMLDivElement).getAttribute('id') as  string).slice(4)
        const response:Response = await Engine.drive(Number(id))
        try {
        if (response.status === 500) throw new Error ('engine off')
      } catch{
        animationArr[index].pause()
      }
      })
      animationArr.forEach(async(elem:Animation) => {
        elem.play()
        winners.push(elem.finished)
      })
      const winner = await Promise.race(winners);
      const carId = (carList[+winner.id] as HTMLDivElement).getAttribute('id')?.slice(4)

      const winnerCar = await Garage.getCar(Number(carId))
      const winnerSpeed = engineParametrs[+winner.id]
      const winnerTime = Math.round(winnerSpeed.distance / winnerSpeed.velocity)
      
      const modal = Layout.getPopoUp(winnerCar.name, winnerTime)
      const body = document.querySelector('body') as HTMLBodyElement;
      body.append(modal)
      modal.addEventListener('click', (event) => {
        body.removeChild(modal)
      })
    }
  })
}



const resetAll = async() => {
  const statusField = document.querySelector('#statusField')
  statusField?.addEventListener ('click', (event:Event) => {
    if((event.target as HTMLButtonElement).innerText === 'reset All') {
      const carList = document.querySelectorAll('.car') as NodeList
      carList.forEach(async(elem) => {
        let car = (elem as HTMLDivElement).querySelector('svg') as SVGElement
        const id = ((elem as HTMLDivElement).getAttribute('id') as  string).slice(4)
        await Engine.stopEngine(Number(id))
        car.style.transform = 'translateX(0)'
      })
    }
  })
}