import './styles/bootstrap.css';
import './styles/global.css';
import carTemplate from  '../assets/pic/race-car.svg'

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
                race-status
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
                <button type="button" class="btn btn-outline-secondary p-2">reset</button>
                <div class="figure">
                <svg style = "fill:${carColor}">${carTemplate}</svg>
                </div>
              </div>  
            </div>`)
  };

  getBody = (CarBase:any):HTMLDivElement => {
    const inner = document.createElement('div')
    inner.innerHTML = `<div class="container-fluid">
    <div class="row">
      <div class="col-3" id="operationField"></div>
      <div class="col" id="statusField"></div>
    </div>
    <div class="row" id="counter">
      <h3>Garage(${CarBase.length})</h3>
      <h4>Page#1</h4>
    </div>
    <div class="row d-flex flex-column gap-3" id="cars-in-garage">

    </div>
    </div>`
    return (inner);
  };
}