const usernameForm = document.querySelector('.modal-form')
const usernameError = document.querySelector('.error-container')
const modalWindow = document.querySelector('.modal-window')

const buttonRedirectFriends = document.querySelector('#show-request')
const buttonRedirectChat = document.querySelector('#show-friends')

buttonRedirectFriends.addEventListener('click', () => {
    window.location.href = '/friends'
})

buttonRedirectChat.addEventListener('click', () => {
    window.location.href = '/chat'
})

function getCSRFToken(){
    return document.querySelector('meta[name="csrf_token"]').getAttribute('content')
}

document.addEventListener("DOMContentLoaded", function() {
    if (modalWindow) {
        document.body.classList.add('modal-open');
    }
})

try{
    usernameForm.addEventListener("submit", async function(event){
        event.preventDefault()

        const formData = new FormData(event.target)

        const responce = await fetch(usernameForm.action, {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest"
            }
        })
        const data = await responce.json()
        if (data.answer == true){
            modalWindow.remove()
            document.body.classList.remove('modal-open');
        }
        else{
            usernameError.innerHTML = ""
            for (const key in data.errors){
                const errors = data.errors[key]
                errors.forEach(error => {
                    const errorElement = document.createElement("p")
                    errorElement.classList.add("error")
                    errorElement.textContent = error.message
                    usernameError.append(errorElement)
                })
            }
        }
    })
}
catch{}