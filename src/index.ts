import { carBase } from "./assets/db/db";
import { addCar } from "./Controlers/addCar";
import { animation } from "./Controlers/animation";
import { Render } from "./View/RanderLayout";

const lay = new Render
let currentBase = [...carBase]
let selectedCar: number[] =[];
const body = document.querySelector('body') as HTMLBodyElement;
body.append(lay.renderLayout(currentBase));
lay.renderGarage(currentBase)
const submitInputs = (document.querySelector('.car-update') as HTMLDivElement).querySelectorAll('input')
if (selectedCar.length === 0) {
  submitInputs.forEach((elem) => (elem as HTMLInputElement).setAttribute('disabled', 'true'))
}

const createButton = document.querySelector('.submit-create')
createButton?.addEventListener('click', (event) => {
    event.stopPropagation()
    const color = (document.querySelector('.color-create') as HTMLInputElement).value
    const name = (document.querySelector('.name-create') as HTMLInputElement).value
    if(color && name) {
        addCar(name,color,currentBase)
        lay.renderGarage(currentBase)
    }
    const counter = document.querySelector('#counter') as HTMLDivElement;
    (counter.firstElementChild as HTMLHeadElement).innerHTML = `Garage(${currentBase.length})`
})

const carsInGarage = document.querySelector('#cars-in-garage') as HTMLDivElement
carsInGarage.addEventListener('click', (event:Event) => {
  if((event.target as HTMLButtonElement).innerText === "Select"){
    const currentCar = (event.target as HTMLButtonElement).closest('.car') as HTMLDivElement
    const id:string = (currentCar.getAttribute('id') as  string).slice(4)
    selectedCar = [ Number(id)]
    submitInputs.forEach((elem) => (elem as HTMLInputElement).removeAttribute('disabled'))
    const updateButton = document.querySelector('.submit-update') as HTMLDivElement
    updateButton.addEventListener('click', (event) => {
      event.stopPropagation()
      const color = (document.querySelector('.color-update') as HTMLInputElement).value
      const name = (document.querySelector('.name-update') as HTMLInputElement).value
      currentBase = currentBase.map((elem) => {
        if(elem.id === selectedCar[0]){
          elem.color = color;
          elem.name = name;
        } 
        return elem
      })
      lay.renderGarage(currentBase);
      submitInputs.forEach((elem) => (elem as HTMLInputElement).setAttribute('disabled', 'true'))
    })
  }
})
carsInGarage.addEventListener('click', (event) => {
  if((event.target as HTMLButtonElement).innerText === "Remove"){
    const currentCar = (event.target as HTMLButtonElement).closest('.car') as HTMLDivElement
    const id:string = (currentCar.getAttribute('id') as  string).slice(4)
    selectedCar = [ Number(id)]
    const index = currentBase.findIndex((elem) => elem.id === selectedCar[0])
    currentBase.splice(index,1)
    lay.renderGarage(currentBase);
    const counter = document.querySelector('#counter') as HTMLDivElement;
    (counter.firstElementChild as HTMLHeadElement).innerHTML = `Garage(${currentBase.length})`
  }
})

carsInGarage.addEventListener('click', (event) => {
  if((event.target as HTMLButtonElement).innerText === "start"){
    const currentCar = (event.target as HTMLButtonElement).closest('.car') as HTMLDivElement
    let car = currentCar.querySelector('svg') as SVGElement
    animation(car,1200,3000)
  }
} )

carsInGarage.addEventListener('click', (event) => {
  if((event.target as HTMLButtonElement).innerText === "reset"){
    const currentCar = (event.target as HTMLButtonElement).closest('.car') as HTMLDivElement
    let car = currentCar.querySelector('svg') as SVGElement
    car.style.transform = 'translateX(0)'
  }
} )

