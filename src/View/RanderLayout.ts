import { Car, Cars, Winners } from '../types/types';
import { Layout } from './layout';

export class Render {
	Base : Layout
	constructor() {
		this.Base = new Layout();
	}

	renderLayout = () => {
		const operations: string[] = ['create', 'update']
		let bodyInner = this.Base.getBody() as HTMLDivElement;
		const operationField  = bodyInner.querySelector('#operationField') as HTMLDivElement
		operations.forEach(((elem) => {
			operationField.innerHTML += this.Base.getOperationsField(elem)
		}))
		return bodyInner
	}
  renderStatus = () => {
    const statusField = document.querySelector('#statusField') as HTMLDivElement
    statusField.innerHTML = this.Base.getStatusField()
  }

	renderGarage = (Cars:Cars) => {
		const garage = document.querySelector('#cars-in-garage') as HTMLDivElement
		garage.innerHTML ='';
		Cars.item.forEach((el:Car) => garage.innerHTML += this.Base.getCar(el.id,el.name, el.color));
		const counter = document.querySelector('#counter') as HTMLDivElement;
		(counter.firstElementChild as HTMLHeadElement).innerText = `Garage(${Cars.count})`;
		const page = sessionStorage.getItem('page');
		const pageInt = page ? +page : 1;
		(counter.lastElementChild as HTMLHeadElement).innerText = `page(${pageInt})`;
	}

	 rengerWinners = (winners:Winners) => {
		const content = document.querySelector('.content-wrapper') as HTMLElement;
		content.innerHTML ='';
		content.innerHTML = this.Base.getWinners();
		(content.querySelector('h1') as HTMLHeadingElement).innerText = `Winners(${winners.count})`
		const page = sessionStorage.getItem('winnerspage');
		const pageInt = page ? +page : 1;
		(content.querySelector('h2') as HTMLHeadingElement).innerText = `page#${pageInt}`
	}
}