const registerBtn = document.querySelector('.register-button')
const authBtn = document.querySelector('.auth-button')
const backBtn = document.querySelector('.back')

const registerFormDiv = document.querySelector(".register-form")
const authFormDiv = document.querySelector(".login-form")
const confirmFormDiv = document.querySelector(".confirm-form")

const registerForm = document.querySelector(".form-for-register")
const authForm = document.querySelector(".form-for-login")
const confirmForm = document.querySelector(".form-for-confirm")

const registerErrors = document.querySelector(".register-error-container")
const authErrors = document.querySelector(".login-error-container")
const confirmErrors = document.querySelector(".confirm-error-container")

const navBtns = document.querySelector(".switch")


registerBtn.addEventListener('click', () => {
    registerFormDiv.classList.remove('hidden-form')
    authFormDiv.classList.add('hidden-form')
    confirmFormDiv.classList.add('hidden-form')

    registerBtn.classList.add('select-button')
    authBtn.classList.remove('select-button')
})

authBtn.addEventListener('click', () => {
    registerFormDiv.classList.add('hidden-form')
    authFormDiv.classList.remove('hidden-form')
    confirmFormDiv.classList.add('hidden-form')

    authBtn.classList.add('select-button')
    registerBtn.classList.remove('select-button')
})

function getCSRFToken(){
    return document.querySelector('meta[name="csrf_token"]').getAttribute('content')
}

registerForm.addEventListener("submit", async function(event){
    event.preventDefault()

    const formData = new FormData(event.target)

    const responce = await fetch(registerForm.action, {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest"
            }
    })
    const data = await responce.json()
    if (data.answer == true){
            registerFormDiv.classList.add('hidden-form')
            authFormDiv.classList.add('hidden-form')
            confirmFormDiv.classList.remove('hidden-form')

            navBtns.classList.add('hidden-form')
    }
    else{
        registerErrors.innerHTML = ""
        for (const key in data.errors){
            const errors = data.errors[key]
            errors.forEach(error => {
                const errorElement = document.createElement("p")
                errorElement.classList.add("error")
                errorElement.textContent = error.message
                registerErrors.append(errorElement)
            })
        }
    }
})

confirmForm.addEventListener("submit", async function(event){
    event.preventDefault()

    const formData = new FormData(event.target)

    const responce = await fetch(confirmForm.action, {
        method: "POST",
        body: formData,
        headers: {
            "X-CSRFToken": getCSRFToken(),
            "X-Requested-With": "XMLHttpRequest"
        }
    })
    const data = await responce.json()
    if (data.answer == true){
        registerFormDiv.classList.add('hidden-form')
        authFormDiv.classList.remove('hidden-form')
        confirmFormDiv.classList.add('hidden-form')
        
        authBtn.classList.add('select-button')
        registerBtn.classList.remove('select-button')

        navBtns.classList.remove('hidden-form')
    }
    else{
        confirmErrors.innerHTML = ""
        for (const key in data.errors){
            const errors = data.errors[key]
            errors.forEach(error => {
                const errorElement = document.createElement("p")
                errorElement.classList.add("error")
                errorElement.textContent = error.message
                confirmErrors.append(errorElement)
            })
        }
    }
})

authForm.addEventListener("submit", async function(event){
    event.preventDefault()

    const formData = new FormData(event.target)

    const responce = await fetch(authForm.action, {
        method: "POST",
        body: formData,
        headers: {
            "X-CSRFToken": getCSRFToken(),
            "X-Requested-With": "XMLHttpRequest"
        }
    })
    const data = await responce.json()
    if (data.answer == true){
        window.location.href = "/";
    }
    else{
        authErrors.innerHTML = ""
        for (const key in data.errors){
            const errors = data.errors[key]
            errors.forEach(error => {
                const errorElement = document.createElement("p")
                errorElement.classList.add("error")
                errorElement.textContent = error.message
                authErrors.append(errorElement)
            })
        }
    }
})

backBtn.addEventListener('click', () => {
    registerFormDiv.classList.remove('hidden-form')
    authFormDiv.classList.add('hidden-form')
    confirmFormDiv.classList.add('hidden-form')

    authBtn.classList.remove('select-button')
    registerBtn.classList.add('select-button')

    navBtns.classList.remove('hidden-form')
})