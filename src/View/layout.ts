import './styles/bootstrap.css';
import './styles/global.css';
import carTemplate from  '../assets/pic/race-car.svg'
import finishFlag from '../assets/pic/racing-finish.svg'

export class Layout {
  getOperationsField  = (operationName:string):string => {
    return (`<div class="car-${operationName} input-group mb-1">
              <input type="text"  class="form-control name-${operationName}">
              <input type="color" class="form-control form-control-color color-${operationName}">
              <input class="submit-${operationName} btn btn-primary" type="submit" value=${operationName}>
            </div>`)
  };

  getStatusField = ():string => {
    return (`<div class="race-status">
              <button type="button" class="btn btn-primary p-2 id ="start-all"">start All</button>
              <button type="button" class="btn btn-secondary p-2" id ="reset-all">reset All</button>
              <button type="button" class="btn btn-success p-2" id="generate-car">Generate</button>
            </div>`)
  };

  getCar = (carID:number, carName:string, carColor:string):string => {
    return (`<div class="car d-flex flex-column gap-3" id = car-${carID}>
              <div class="car-setting d-flex flex-row gap-1">
                <button type="button" class="btn btn-primary p-2">Select</button>
                <button type="button" class="btn btn-secondary p-2">Remove</button>
                <h5 class = "car-name">${carName}</h5>
              </div>
              <div class="race-setting d-flex flex-row gap-1">
                <button type="button" class="btn btn-outline-primary p-2">start</button>
                <button type="button" class="btn btn-outline-warning p-2" disabled>reset</button>
                <div class="carimg">
                <svg style = "fill:${carColor}">${carTemplate}</svg>
                <svg class="finish-flag">${finishFlag}</svg>
                </div>
              </div>  
            </div>`)
  };

  getBody = ():HTMLDivElement => {
    const inner = document.createElement('div')
    inner.innerHTML = `
    <div class="container-fluid">
    <div class="row">
      <div class="col-3" id="operationField"></div>
      <div class="col" id="statusField"></div>
    </div>
    <div class="row" id="counter">
      <h3>Garage(0)</h3>
      <h4>Page#1</h4>
    </div>
    <div class="row d-flex flex-column gap-3" id="cars-in-garage" ></div>
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-start mt-5">
        <li class="page-item prev">
          <a class="page-link prev">Previous</a>
        </li>
        <li class="page-item next">
          <a class="page-link next">Next</a>
        </li>
      </ul>
    </nav>
    </div>`
    return (inner);
  };

  static getHeader = () => {
    const header = document.createElement('header')
      header.innerHTML = 
      `<div class ="container-fluid d-flex gap-2" id="header-wrapper">
        <input type="radio" class="btn-check" name="options" id="option1" autocomplete="off" checked>
        <label class="btn btn-primary" for="option1">To Garage</label>
    
        <input type="radio" class="btn-check" name="options" id="option2" autocomplete="off">
        <label class="btn btn-primary" for="option2">To Winner</label>
      </div>
      `
    return header
  }

  static getContetnWrapper = () => {
    const wrapper = document.createElement('Section')
    wrapper.classList.add("content-wrapper")
    return wrapper
  }
  static getPopoUp = (name:string, time:number) => {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.innerHTML = `
    <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Vinner is ${name}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Finished whith ${time} sec.</p>
      </div>
    </div>
  </div>`
    return modal
  }
}