export const animation = (elem:any, finish:number, duration:number) => {
    let currentX = 0;
    console.log(currentX)
    const fps = duration / 1000 * 60;
    let dx = (finish - currentX) / fps
    let intervalID = setInterval(() => {
        currentX += dx;
        if(currentX > finish){
            clearInterval(intervalID)
        }
        elem.style.transform = `translateX(${currentX}px)`
    },16)
}