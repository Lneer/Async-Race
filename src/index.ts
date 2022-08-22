import { startGarage } from "./pages/Garage";
import { startWinners} from "./pages/Winners";
import { Layout } from "./view/layout";

const body = document.querySelector('body') as HTMLBodyElement;
body.append(Layout.getHeader())
body.append(Layout.getContetnWrapper());
type Page = {
  garage:boolean,
  winners:boolean,
}
const pages = {
  garage: true,
  winners: false
}
const randerPage  = (pages:Page):void => {
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

