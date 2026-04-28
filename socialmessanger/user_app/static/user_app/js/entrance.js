const registerBtn = document.querySelector('.register-button')
const authBtn = document.querySelector('.auth-button')
const backBtn = document.querySelector('.back')

const registerForm = document.querySelector(".register-form")
const authForm = document.querySelector(".login-form")
const confirmForm = document.querySelector(".confirm-form")

const navBtns = document.querySelector(".switch")


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

function getCSRFToken(){
    return document.querySelector('meta[name="csrf_token"]').getAttribute('content')
}

document.querySelector(".register-form").addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);

        fetch(form.action, {
            method: "POST", 
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest",
            },
            body: formData  
        })
            .then(async (response) => {
                const data = await response.json()
                if (!response.ok){
                    throw data;    
                }
                return data
            })   
            .then((data)=>{ // Что в случае успеха
                registerForm.classList.add('hidden-form')
                authForm.classList.add('hidden-form')
                confirmForm.classList.remove('hidden-form')

                navBtns.classList.add('hidden-form')
            })
            .catch((data)=>{
                if(data.errors){
                    console.log(data.errors)
                }
            })
    }
)


document.querySelector(".confirm-form").addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);

        fetch(form.action, {
            method: "POST", 
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest",
            },
            body: formData  
        })
            .then(async (response) => {
                const data = await response.json()
                if (!response.ok){
                    throw data;    
                }
                return data
            })
            .then((data)=>{ // Что в случае успеха
                registerForm.classList.add('hidden-form')
                authForm.classList.remove('hidden-form')
                confirmForm.classList.add('hidden-form')
                
                authBtn.classList.add('select-button')
                registerBtn.classList.remove('select-button')
            })
            .catch((data)=>{
                if(data.errors){
                    console.log(data.errors)
                }
            })
    }
)

backBtn.addEventListener('click', () => {
    registerForm.classList.remove('hidden-form')
    authForm.classList.add('hidden-form')
    confirmForm.classList.add('hidden-form')

    authBtn.classList.remove('select-button')
    registerBtn.classList.add('select-button')

    navBtns.classList.remove('hidden-form')
})