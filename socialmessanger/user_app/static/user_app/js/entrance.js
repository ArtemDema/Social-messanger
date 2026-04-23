const registerBtn = document.querySelector('.register-button')
const authBtn = document.querySelector('.auth-button')

const registerForm = document.querySelector(".register-form")
const authForm = document.querySelector(".login-form")
const confirmForm = document.querySelector(".confirm-form")

registerBtn.addEventListener('click', () => {
    registerForm.classList.remove('hidden-form')
    authForm.classList.add('hidden-form')
    confirmForm.classList.add('hidden-form')

    registerBtn.classList.add('select-button')
    authBtn.classList.remove('select-button')
})

authBtn.addEventListener('click', () => {
    registerForm.classList.add('hidden-form')
    authForm.classList.remove('hidden-form')
    confirmForm.classList.add('hidden-form')

    authBtn.classList.add('select-button')
    registerBtn.classList.remove('select-button')
})