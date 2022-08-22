import { animation } from '../controlers/animation';
import { generateCar } from '../controlers/utils/generateCars';
import { getCarID } from '../controlers/utils/getCarId';
import { listenCreate } from '../controlers/utils/listenerCreate';
import { toggleUpdateField } from '../controlers/utils/toggleUpdate';
import { EngineHandler, GarageHandler, WinnerHandler } from '../controlers/Requests';
import { Layout } from '../view/layout';
import { Render } from '../view/RanderLayout';
import { Car, EngineParameters } from '../types/types';

const link = 'http://127.0.0.1:3000'
const Garage = new GarageHandler(link);
const Engine = new EngineHandler(link);
const Winner = new WinnerHandler(link)
const GarageRender = new Render()

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
    resetAll()
  })
}
const  createCarBody = async() => {
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

const deleteCar = async() => {
  let page = sessionStorage.getItem('page') ? +(sessionStorage.getItem('page') as string) : 1
  const carsInGarage = document.querySelector('#cars-in-garage') as HTMLDivElement
  carsInGarage.addEventListener('click', async(event:Event) => {
    if(getCarID(event, 'Remove')) {
      const id = getCarID(event,'Remove') as number
      await Garage.deleteCar(id)
      const data = await Garage.getCars(page)
      GarageRender.renderGarage(data)
      const winnersStatus = await Winner.getWinnerStatus(id)
       if (winnersStatus === 200) Winner.deleteWinner(id)
    }
  })
}
const updateCar = async() => {
  const carsInGarage = document.querySelector('#cars-in-garage') as HTMLDivElement
  let id:number = 0;
  let updateStatus:boolean = false;
  let car:Car 
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

const generateCars  = async() =>{
  let page = sessionStorage.getItem('page') ? +(sessionStorage.getItem('page') as string) : 1
  const generateButton = document.querySelector('#generate-car')
  generateButton?.addEventListener('click', async() => {
    for(let i = 0; i<100; i++){
      const car = generateCar()
      await Garage.createCar(car)
    }
    const data = await Garage.getCars(page)
     GarageRender.renderGarage(data)
     startGarage()
  })
}
const pagination = async() => {
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
      page = page === totalPages ? totalPages : page+1
    }
    sessionStorage.setItem('page',`${page}`)
    const data = await Garage.getCars(page)
    GarageRender.renderGarage(data)
    startGarage()
   })

}

const startEngine = async() => {
  const carsInGarage = document.querySelector('#cars-in-garage') as HTMLDivElement
  const resetAllButton =  document.querySelector('#reset-all') as HTMLButtonElement;
  carsInGarage.addEventListener('click', async(event) => {
    resetAllButton.removeAttribute('disabled')
    const carDiv = (event.target as HTMLButtonElement).closest('.car') as HTMLDivElement;
    const id = getCarID(event, 'start') as number
    if(!id) return
    const egineParam = await Engine.startEngine(id)
    let car = carDiv.querySelector('svg') as SVGElement
    const carAnimation = animation(car,egineParam.distance, egineParam.velocity)
    carAnimation.id = id.toString()
    carAnimation.play();
    (carDiv.querySelector('.btn-outline-warning') as HTMLButtonElement).toggleAttribute('disabled')
    try {
      const engineResponse = await Engine.drive(id)
      if(engineResponse.status === 500) throw new Error('500 error')
    } catch  {
        carAnimation.pause()
      }
  })
}

const resetEngine =async() => {
  const carsInGarage = document.querySelector('#cars-in-garage') as HTMLDivElement
  carsInGarage.addEventListener('click', async(event) => {
    const carDiv = (event.target as HTMLButtonElement).closest('.car') as HTMLDivElement;
    const id = getCarID(event, 'reset') as number
    if(!id) return
    await Engine.stopEngine(id)
    document.getAnimations().forEach((elem) => {
      if (elem.id === id.toString()) elem.cancel()
    })
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
  const resetAllButton =  document.querySelector('#reset-all') as HTMLButtonElement;
  const startAllButton =  document.querySelector('#start-all') as HTMLButtonElement;
  const carList = document.querySelectorAll('.car') as NodeList;
  startAllButton.addEventListener('click', async() => {
    
    let engineParametrs:EngineParameters[] = [];
    const promises:Promise<EngineParameters>[] = [];
    const animationArr:Animation[] =[];
    const winners:Promise<Animation>[] = [];
    carList.forEach((elem, index) => {
      const id = ((carList[index] as HTMLDivElement).getAttribute('id') as  string).slice(4)
      promises.push( Engine.startEngine(Number(id)))
    })
    engineParametrs = await Promise.all(promises)
    
    carList.forEach(async(elem, index) => {
      let car = (elem as HTMLDivElement).querySelector('svg') as SVGElement;
      const anim =  animation(car,engineParametrs[index].distance,engineParametrs[index].velocity);
      anim.id = `${index}`;
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
    resetAllButton.removeAttribute('disabled')
    startAllButton.setAttribute('disabled','true')
    const winner = await Promise.race(winners);
    const carId = (carList[+winner.id] as HTMLDivElement).getAttribute('id')?.slice(4)
    const winnerCar = await Garage.getCar(Number(carId))
    const winnerSpeed = engineParametrs[+winner.id]
    const winnerTime = +(winnerSpeed.distance / (winnerSpeed.velocity * 1000)).toFixed(2)
    await Winner.saveWinner(Number(carId),winnerTime)
    const modal = Layout.getPopoUp(winnerCar.name, winnerTime)
    const body = document.querySelector('body') as HTMLBodyElement;
    body.append(modal)
    modal.addEventListener('click', (event) => {
      body.removeChild(modal)
    })

  })
}



const resetAll = async() => {
  const resetAllButton =  document.querySelector('#reset-all') as HTMLButtonElement;
  const startAllButton =  document.querySelector('#start-all') as HTMLButtonElement;
  resetAllButton.addEventListener ('click', (event:Event) => {
    resetAllButton.setAttribute('disabled','true')
    const carList = document.querySelectorAll('.car') as NodeList
    carList.forEach(async(elem) => {
      const id = ((elem as HTMLDivElement).getAttribute('id') as  string).slice(4);
      ((elem as HTMLDivElement).querySelector('.btn-outline-primary') as HTMLButtonElement).removeAttribute('disabled');
      ((elem as HTMLDivElement).querySelector('.btn-outline-warning ') as HTMLButtonElement).setAttribute('disabled','true');
      await Engine.stopEngine(Number(id))
    })
    document.getAnimations().forEach((elem) => elem.cancel())
    startAllButton.removeAttribute('disabled')
  })
}
