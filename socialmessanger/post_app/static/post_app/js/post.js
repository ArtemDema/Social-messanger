const postButton = document.querySelector('.create-post')
const closeButton = document.querySelector('.modal-exit')

const modalWindow = document.querySelector('.modal-window')

postButton.addEventListener('click', () => {
    modalWindow.style = ""
})

closeButton.addEventListener('click', () => {
    modalWindow.style.display = 'none'
})