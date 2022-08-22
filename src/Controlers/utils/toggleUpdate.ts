export const toggleUpdateField = ():void => {
    const submitInputs = (document.querySelector('.car-update') as HTMLDivElement).querySelectorAll('input')
    submitInputs.forEach((elem) => (elem as HTMLInputElement).toggleAttribute('disabled'));
}