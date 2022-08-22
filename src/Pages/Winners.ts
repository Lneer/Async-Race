import { GarageHandler, WinnerHandler } from "../controlers/Requests"
import { Render } from "../view/RanderLayout"
const link = 'http://127.0.0.1:3000'
const Winner = new WinnerHandler(link)
const Garage = new GarageHandler(link)
const PageRender = new Render()
export const winnersPage = async() => {
  const winnerPerPage = 10;
  let page = sessionStorage.getItem('winnerspage') ? +(sessionStorage.getItem('winnerspage') as string) : 1
  let sortType = sessionStorage.getItem('sortType') ? sessionStorage.getItem('sortType') : 'time'
  let orderType = sessionStorage.getItem('orderType') ? sessionStorage.getItem('orderType') : 'ASC'
  const winners = await Winner.getWinners(page,winnerPerPage,sortType as string, orderType as string)
  PageRender.rengerWinners(winners)
  if(winners.items) {
    for(let i = 0; i < winners.items.length; i ++){
      const car = await Garage.getCar(winners.items[i].id)
      const row = PageRender.Base.getWinner(i,{wins: winners.items[i].wins, time:winners.items[i].time,}, {color:car.color, name: car.name})
      const table = document.querySelector('#winner-tbody') 
      table?.append(row)
    }
  }
}

export const startWinners = () =>{
  winnersPage().then(() => {
    pagination()
    sortingResult()
  })
}

const pagination = async() => {
  const carsPerPage = 10;
  const paginationBody = document.querySelector('.pagination-winners')
   paginationBody?.addEventListener('click', async(event:Event) =>{
    let page = sessionStorage.getItem('winnerspage') ? +(sessionStorage.getItem('winnerspage') as string) : 1
    let sortType = sessionStorage.getItem('sortType') ? sessionStorage.getItem('sortType') : 'time'
    let orderType = sessionStorage.getItem('orderType') ? sessionStorage.getItem('orderType') : 'ASC'
    const data = await Winner.getWinners(page,carsPerPage,sortType as string, orderType as string)
    if((event.target as HTMLLIElement).classList.contains('prev')){
      page = page===1? 1: page - 1
    }
    if((event.target as HTMLLIElement).classList.contains('next')){
      const totalPages = data.count ? Math.ceil(+data.count / carsPerPage) : 1
      page = page === totalPages ? totalPages : page+1
    }
    sessionStorage.setItem('winnerspage',`${page}`)
    startWinners()
   })

}

const sortingResult =  () => {
  const toWinner = document.querySelector('.count-sort')
  const toTime = document.querySelector('.time-sort')

  toWinner?.addEventListener('click',() => {
    (toTime?.firstElementChild as HTMLSpanElement).classList.add('display')
    toWinner?.firstElementChild?.classList.remove('display')
    let sortType = sessionStorage.getItem('sortType')
    let orderType = sessionStorage.getItem('orderType')
    if(sortType !== 'wins') sessionStorage.setItem('sortType','wins')
    if(orderType === 'ASC') {
      sessionStorage.setItem('orderType','DESC')
    } else {
      sessionStorage.setItem('orderType','ASC')
    }
    startWinners()
  })
  toTime?.addEventListener('click',() => {
    // toWinner?.setAttribute('disabled', 'true')
    let sortType = sessionStorage.getItem('sortType')
    let orderType = sessionStorage.getItem('orderType')
    if(sortType !== 'time') sessionStorage.setItem('sortType','time')
    if(orderType === 'ASC') {
      sessionStorage.setItem('orderType','DESC')
    } else {
      sessionStorage.setItem('orderType','ASC')
    }
    
    startWinners()
  })

}