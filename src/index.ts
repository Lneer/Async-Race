import { startGarage } from "./Pages/Garage";
import { startWinners, winnersPage } from "./Pages/Winners";
import { Layout } from "./View/layout";

const body = document.querySelector('body') as HTMLBodyElement;
body.append(Layout.getHeader())
body.append(Layout.getContetnWrapper());
// alert('Подождите с проверкой до четверга. Спасибо за понимание')
const pages = {
  garage: true,
  winners: false
}
const randerPage  = (pages:any):void => {
  if(pages.garage) {
    startGarage()
  } else startWinners()
}
randerPage(pages)
const header = document.querySelector('#header-wrapper') as HTMLDivElement

header.addEventListener('change', () => {
  pages.garage = (document.querySelector('#option1') as HTMLInputElement).checked === true
  pages.winners = (document.querySelector('#option2') as HTMLInputElement).checked === true
  randerPage(pages)
})

