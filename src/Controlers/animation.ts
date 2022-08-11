export const animation = (elem: SVGElement, finish:number, velosity:number) => {
    const raceSettings = ((elem as SVGElement).closest('.race-setting') as HTMLDivElement);
    const statusField = document.querySelector('#statusField') as HTMLDivElement;
    const startButton = raceSettings.querySelector('.btn-outline-primary') as HTMLButtonElement;
    const resetButton = raceSettings.querySelector('.btn-outline-warning') as HTMLButtonElement;

    const startAllButton = statusField.querySelector('.btn-primary') as HTMLButtonElement;
    const resetAllButton = statusField.querySelector('.btn-secondary') as HTMLButtonElement;
    const buttonSet: HTMLButtonElement[] = [startButton,startAllButton]
    buttonSet.forEach((elem) => elem.toggleAttribute('disabled'))
    
    const screenWidth = window.innerWidth
    const k = finish / (0.8*screenWidth)
    const carsFrames = new KeyframeEffect(elem,[{transform: 'translateX(0)'},{transform: 'translateX(80vw)'}],{
        fill: 'forwards',
        easing: 'linear',
        duration: 0.8*screenWidth / (velosity / k )} )
    return  new Animation(carsFrames,document.timeline)
}