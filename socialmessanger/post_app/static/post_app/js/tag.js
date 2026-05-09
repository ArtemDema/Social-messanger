const postCreateTag = document.querySelector('.post-create-tag')
const tagModalWindow = document.querySelector('.tag-modal-window')
const postCreateForm = document.querySelector('.tag-modal-form')

const pModalWindow = document.querySelector('.post-modal-window')

const tagButtonExit = document.querySelector('.tag-modal-exit')


function getCSRFToken(){
    return document.querySelector('meta[name="csrf_token"]').getAttribute('content')
}

postCreateTag.addEventListener('click', ()=>{
    pModalWindow.style.display = 'none'
    tagModalWindow.style.display = ''
})

tagButtonExit.addEventListener('click', ()=>{
    tagModalWindow.style.display = 'none'
    pModalWindow.style.display = ''
})


postCreateForm.addEventListener("submit", async function(event){
    event.preventDefault()

    const formData = new FormData(event.target)

    const responce = await fetch(postCreateForm.action, {
        method: "POST",
        body: formData,
        headers: {
            "X-CSRFToken": getCSRFToken(),
            "X-Requested-With": "XMLHttpRequest"
        }
    })
    const data = await responce.json()
    if (data.answer == true){
        pModalWindow.style.display = ''
        tagModalWindow.style.display = 'none'
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