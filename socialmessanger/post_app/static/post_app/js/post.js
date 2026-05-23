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

const postImage = document.querySelector('#photo-img')
const postImageButton = document.querySelector('#id_images')
const previewContainer = document.querySelector('.post-preview-container')

const postTextArea = document.querySelector('#post-textarea')

let selectedFiles = []

postImage.addEventListener('click', () => {
    postImageButton.click()
})


postImageButton.addEventListener('change', function () {

    selectedFiles = Array.from(this.files)

    renderPreviews()
})


function renderPreviews() {

    previewContainer.innerHTML = ""

    selectedFiles.forEach((file, index) => {

        if (!file.type.startsWith("image/")) return

        const reader = new FileReader()

        reader.onload = function (event) {

            const wrapper = document.createElement('div')
            wrapper.classList.add('preview-wrapper')

            const img = document.createElement('img')
            img.src = event.target.result
            img.classList.add('preview-image')

            const photo_img = document.createElement('img')
            photo_img.src = DELETE_BUTTON
            photo_img.classList.add('delete-photo')

            photo_img.classList.add('remove-btn')

            photo_img.addEventListener('click', () => {
                removeFile(index)
            })

            wrapper.appendChild(img)
            wrapper.appendChild(photo_img)

            previewContainer.appendChild(wrapper)
        }

        reader.readAsDataURL(file)
    })
}


function removeFile(index) {

    selectedFiles.splice(index, 1)

    const dataTransfer = new DataTransfer()

    selectedFiles.forEach(file => {
        dataTransfer.items.add(file)
    })

    postImageButton.files = dataTransfer.files

    renderPreviews()
}


postButton.addEventListener('click', () => {
    postModalWindow.style = ""
})



closeButton.addEventListener('click', () => {
    postModalWindow.style.display = 'none'
})



createlinkBtn.addEventListener('click', () => {
    if(listLink.childElementCount <= 11){
        link = document.createElement('input')
        link.type = 'url'
        link.name = 'links'
        link.placeholder = "Введіть посилання"

        if(listLink.childElementCount == 2){
            const lastElement = listLink.lastElementChild;
        }
        const lastElement = listLink.children[listLink.children.length - 2];
        
        listLink.insertBefore(link, lastElement);
    }

    if(listLink.childElementCount == 3){
        img = document.createElement('img')
        img.src = MINUS_ICON
        img.classList.add('delete-link')

        listLink.append(img)

        img.addEventListener('click', () => {
            if(listLink.childElementCount == 4){
                img.remove()
            }
            link = listLink.children[listLink.children.length - 3];
            link.remove()
        })
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
        modalForm.reset();
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

postButton.addEventListener('click', ()=> {
    textArea.value = postTextArea.value
})