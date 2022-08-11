type options = {
   page: number;
   limit: number;
}
type body = {
  name:string,
  color:string,
}
export class GarageHandler {
  BaseLink:string
  constructor (Baselink:string){
    this.BaseLink = Baselink
  }
  getCars  = async (page:number, limit:number = 7) => {
    let fullUrl:string = this.BaseLink + `\\garage?_page=${page}&_limit=${limit}` 
    const response = await fetch(fullUrl)
    return {
      item: await response.json(),
      count: response.headers.get('X-Total-Count'),
    }
  }

  getCar  = async (id:number) => {
    let fullUrl:string = this.BaseLink + `\\garage\\${id}`
    const response = await fetch(fullUrl)
    return response.json();
  }

  createCar = async (body:body) => {
    let fullUrl:string = this.BaseLink + '\\garage'
    const method = 'POST'
    const headers = {'Content-Type': 'application/json'}
    const response =  await fetch(fullUrl, {
      method: method,
      headers:headers,
      body: JSON.stringify(body)
    })
    return response.json();
  }

  deleteCar = async(id:number) => {
    let fullUrl:string = this.BaseLink + `\\garage\\${id}`
    const method = 'DELETE'
    const response =  await fetch(fullUrl, {
      method: method,
    })
    return response.json()
  } 

  updateCar = async(id:number, body:body) => {
    let fullUrl:string = this.BaseLink + `\\garage\\${id}`
    const method = 'PUT'
    const headers = {'Content-Type': 'application/json'}
    const response =  await fetch(fullUrl, {
      method: method,
      headers:headers,
      body: JSON.stringify(body)
    })
    return response.json();
  }
}

export class EngineHandler{
  BaseLink:string
  constructor (Baselink:string){
    this.BaseLink = Baselink
  }

  startEngine = async(id:number) => {
    let fullUrl:string = this.BaseLink + `\\engine?id=${id}&status=started`
    const method = 'PATCH'
    const response = await fetch(fullUrl,{
      method:method
    });
    return response.json()
  } 

  stopEngine = async(id:number) => {
    let fullUrl:string = this.BaseLink + `\\engine?id=${id}&status=stopped`
    const method = 'PATCH'
    const response = await fetch(fullUrl, {
      method:method
    });
    return response.json()
  } 

  drive = async(id:number) => {
    let fullUrl:string = this.BaseLink + `\\engine?id=${id}&status=drive`
    const method = 'PATCH'
    const response = await fetch(fullUrl, {
      method:method
    })
    return response 
  }
}

export class WinnerHandler {
  Garage:GarageHandler
  BaseLink:string
  constructor (Baselink:string){
    this.BaseLink = Baselink
    this.Garage = new GarageHandler(Baselink)
  }
  _getSortOrder = (...args:Array<string | undefined>) => {
    if(args && args.length === 2)
     return `&_sort=${args[0]}&_order=${args[1]}`
    return ''
  }
  getWinners = async(page:number, limit = 10, sort:string, order:string ) => {
    let fullUrl:string = this.BaseLink + `\\winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`
    const method = 'GET'
    const response = await fetch(fullUrl,{
      method: method,
    })
    const items: any = response.json()
    return  {
      items: await items,
      count: response.headers.get('X-Total-Count'),
    }
  }

  getWinner = async(id:number) => {
    let fullUrl:string = this.BaseLink + `\\winners\\${id}`
    const method = 'GET'
    const response = await fetch(fullUrl,{
      method:method
    })
    return response.json()
  }

  getWinnerStatus = async(id:number) => {
    let fullUrl:string = this.BaseLink + `\\winners\\${id}`
    const method = 'GET'
    const response = await fetch(fullUrl,{
      method:method
    })
    return response.status
  }
  createWinner = async (body: {id:number, wins:number, time:number}) => {
    let fullUrl:string = this.BaseLink + `\\winners`;
    const method = 'POST'
    const response = await fetch(fullUrl, {
      method: method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }
  deleteWinner = async(id:number) => {
    let fullUrl:string = this.BaseLink + `\\winners\\${id}`
    const method = 'DELETE'
    const response = await fetch(fullUrl,{
      method:method
    })
    return response.json()
  }


  updateWinner = async (id:number, body: { wins: number,time: number}) => {
    let fullUrl:string = this.BaseLink + `\\winners\\${id}`
    const method = 'PUT'
    const response = await fetch(fullUrl,{
      method:method,
      body:JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }

  saveWinner = async (id:number, time:number) =>{
    const winnerStatus = await this.getWinnerStatus(id);
    if (winnerStatus === 404) {
      await this.createWinner({
        id,
        wins:1,
        time,
      })
    } else {
      const winner = await this.getWinner(id);
      await this.updateWinner(id, {
        wins:winner.wins +1 ,
        time: time < winner.time? time: winner.time,
      })
    }
  }
}