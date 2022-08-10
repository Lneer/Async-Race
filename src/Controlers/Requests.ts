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