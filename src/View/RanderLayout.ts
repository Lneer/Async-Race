import { Layout } from "./layout";

export class Render {
	Base : Layout
	constructor() {
		this.Base = new Layout();
	}
  
	renderLayout = (Cars:any) => {
		const operations: string[] = ['create', 'update']
		const bodyInner = this.Base.getBody(Cars) as HTMLDivElement;
		const operationField  = bodyInner.querySelector('#operationField') as HTMLDivElement
	
		operations.forEach(((elem) => {
			operationField.innerHTML += this.Base.getOperationsField(elem)
		}))
		return bodyInner
	}
	renderGarage = (Cars:any) => {
		const garage = document.querySelector('#cars-in-garage') as HTMLDivElement
		garage.innerHTML ='';
		Cars.forEach((el:any) => garage.innerHTML += this.Base.getCar(el.id,el.name, el.color));
	}


}