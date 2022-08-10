export const getCarID = (event:Event, buttonName:string) => {
  if((event.target as HTMLButtonElement).innerText === buttonName){
      const currentCar = (event.target as HTMLButtonElement).closest('.car') as HTMLDivElement
      const id:string = (currentCar.getAttribute('id') as  string).slice(4)
      return   Number(id)
  }
  else return null
}