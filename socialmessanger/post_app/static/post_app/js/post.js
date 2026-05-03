const postButton = document.querySelector('.create-post')
const closeButton = document.querySelector('.modal-exit')

const modalError = document.querySelector('.error-container')
const modalForm = document.querySelector('.modal-form')

const createlinkBtn = document.querySelector('.create-link')
const listLink = document.querySelector('.list-links')
const delLinkBtn = document.querySelector('.delete-link')

const modalWindow = document.querySelector('.modal-window')

postButton.addEventListener('click', () => {
    modalWindow.style = ""
})



closeButton.addEventListener('click', () => {
    modalWindow.style.display = 'none'
})



createlinkBtn.addEventListener('click', () => {
    if(listLink.childElementCount == 1){
        button = document.createElement('button')
        button.type = 'button'
        button.textContent = '-'
        button.classList.add('delete-link')

        modalForm.append(button)

        button.addEventListener('click', () => {
            if(listLink.childElementCount == 2){
                button.remove()
            }
            link = listLink.lastElementChild
            link.remove()
        })
    }

    if(listLink.childElementCount <= 9){
        link = document.createElement('input')
        link.type = 'url'
        link.name = 'link'
        link.placeholder = "Введіть посилання"

        listLink.append(link)
    }
})


function getCSRFToken(){
    return document.querySelector('meta[name="csrf_token"]').getAttribute('content')
}

modalForm.addEventListener("submit", async function(event){
    event.preventDefault()

    const formData = new FormData(event.target)

    const responce = await fetch(modalForm.action, {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest"
            }
    })
    const data = await responce.json()
    if (data.answer == true){
        modalWindow.style.display = 'none'
    }
    else{
        modalError.innerHTML = ""
        for (const key in data.errors){
            const errors = data.errors[key]
            errors.forEach(error => {
                const errorElement = document.createElement("p")
                errorElement.classList.add("error")
                errorElement.textContent = error.message
                modalError.append(errorElement)
            })
        }
    }
})
