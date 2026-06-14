const url = window.location.pathname
const listButtons = document.querySelectorAll('.redirect-link')

listButtons.forEach(currentButton => {
    if (currentButton.getAttribute('href') == url){
        listButtons.forEach(notCurrentButton => {
            notCurrentButton.classList.remove('select')
        })
        currentButton.classList.add('select')
    console.log(currentButton.getAttribute('href'))
    }
});