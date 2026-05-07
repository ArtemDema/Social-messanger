const postButton = document.querySelector('.post-create-post')
const closeButton = document.querySelector('.post-modal-exit')

const modalError = document.querySelector('.post-error-container')
const modalForm = document.querySelector('.post-modal-form')

const createlinkBtn = document.querySelector('.post-create-link')
const listLink = document.querySelector('.post-list-links')
const delLinkBtn = document.querySelector('.post-delete-link')

const postModalWindow = document.querySelector('.post-modal-window')


const tagsContainer = document.querySelector('#id_tags')
const textArea = document.querySelector('#id_content')



postButton.addEventListener('click', () => {
    postModalWindow.style = ""
})



closeButton.addEventListener('click', () => {
    postModalWindow.style.display = 'none'
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
        postModalWindow.style.display = 'none'
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


tagsContainer.addEventListener('change', function(event) {
    const checkbox = event.target

    if(checkbox.type == 'checkbox' && checkbox.checked){

        const label = checkbox.closest("div").querySelector("label");
        let tagText = label.textContent.trim();

        const hashtag = tagText.startsWith("#") ? tagText : `#${tagText}`;
        const separator = textArea.value.length > 0 ? ' ' : '';

        if (!textArea.value.includes(hashtag)) {
            textArea.value += `${separator}${hashtag}`
            label.classList.toggle('is-active')
        }
    }
    else if(checkbox.type == 'checkbox' && !checkbox.checked) {
        const label = checkbox.closest("div").querySelector("label");
        const hashtag = `#${label.textContent.trim()}`;

        textArea.value = textArea.value.replace(hashtag, '').replace(/\s\s+/g, ' ').trim();
        label.classList.toggle('is-active')
    }
})