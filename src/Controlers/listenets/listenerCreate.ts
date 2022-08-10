
export const listenCreate = (event:Event, mode:string = 'create') => {
    event.stopPropagation()
    const color = (document.querySelector(`.color-${mode}`) as HTMLInputElement).value
    const name = (document.querySelector(`.name-${mode}`) as HTMLInputElement).value
    let carSetting:any
    if(color && name) {
       return carSetting = {
        name:  name,
        color: color,
      }
    }
   else return null
  }