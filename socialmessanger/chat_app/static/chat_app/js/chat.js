const chatBtns = [...document.querySelectorAll(".chat")];
const chatDiv = document.querySelector("#chat")
const notSelectContainer = document.querySelector(".not-select")
let chatSocket;

const sendMsg = document.querySelector("#send-msg")
const msgInput = document.querySelector("#msg-input")

const chatButton = document.querySelector(".create-chat-btn")

const chatCreateDiv = document.querySelector(".create-group-modal")
const chatSettingsDiv = document.querySelector(".settings-group-modal")

const listCloseChat = document.querySelectorAll(".close-create-chat-modal")
const listCloseChatSettings = document.querySelector(".close-settings-chat-modal")

const nextChatButton = document.querySelector(".next-create-chat-modal")
const backChatButton = document.querySelector(".back-create-chat-modal")

const selectedUsersContainer = document.querySelector(".selected-users")

const userCheckboxes = chatCreateDiv.querySelectorAll("input[type='checkbox']")

const photosBtn = document.querySelectorAll(".photo")
const imagesBtn = document.querySelector("#id_images")

const chatName = document.querySelector(".chat-name") 

const friendDivs = document.querySelectorAll(".user-friends-div")
const csrfToken = document.querySelector("meta[name='csrf_token']").content

const messages = document.querySelector('#messages')
const loadLine = document.querySelector("#load-message-line")
let pageNumber = 1

async function loadMessages(chat){
    const response = await fetch(
        `/chat/${chat.dataset.id}/getMessages/?page=${pageNumber}`,
        {headers: {'X-Requested-With': 'XMLHttpRequest'}}
    )
    const data = await response.json()
    
    if (data.success){
        data.messages.forEach((message)=>{
            createMessage(message.sender, message.text, message.datetime, message.is_author, false)
        })
    }
}

function createMessage(sender, text, dateTime, is_author, isNew = true){
    const newMessage = document.createElement('div')
    newMessage.classList.add('message')
    if(is_author == "yes"){
        newMessage.classList.add('div-own-msg')
        newMessage.innerHTML = `
        <div class="user-message own-message">
            <h4 class="text">${text}</h4>
            <h6 class="date-time">${dateTime}</h6>
        </div>
        `
    }
    else{
        newMessage.innerHTML = `
        <div class="profile-img"></div>
        <div class="user-message">
            <h5 class="sender">${sender}</h5>
            <h4 class="text">${text}</h4>
            <h6 class="date-time">${dateTime}</h6>
        </div>
    `
    }
    if(isNew){
        messages.appendChild(newMessage)
    }
    else{
        messages.insertBefore(newMessage, loadLine.nextElementSibling)
    }
}


function openChat(chat){
    const others = chatBtns.filter(button => button !== chat);
    others.forEach(otherBtn => {
        otherBtn.classList.remove('selected-chat');
    });

    notSelectContainer.style.display = "none"
    chatDiv.style.display = "flex"

    messages.querySelectorAll(".message").forEach((msg) =>{
        msg.remove()
    })
    pageNumber = 1
    loadMessages(chat)
    
    chatName.innerHTML = ""
    const chatNameH = document.createElement('h2')
    chatNameH.textContent = chat.dataset.name
    chatName.appendChild(chatNameH)

    chat.classList.add('selected-chat')
    
    if (chatSocket){
        chatSocket.close()
    }
    let url = `ws://${window.location.host}/chat/${chat.dataset.id}`;
    chatSocket = new WebSocket(url)
    chatSocket.onmessage = (event)=>{
        const data = JSON.parse(event.data)

        if (data.message){
        createMessage(data.message.sender, data.message.text, data.message.datetime, data.message.is_author)
    }
    }
}

friendDivs.forEach(div => {
    div.addEventListener('click', async ()=>{
        const response = await fetch('/chat/create/', {
            method: "POST",
            headers: {
                'X-CSRFToken' : csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            }, 
            body: JSON.stringify({
                friend_id: div.dataset.id
            })
        })
        const data = await response.json()
        if (data.is_new){
            const newChat = document.createElement('div')
            newChat.classList.add('chat')
            
            newChat.innerHTML = `<div class="profile-img"></div>`
            newChat.innerHTML += `<h3>${data.first_name}</h3>`
            newChat.dataset.id = data.chat_id
            newChat.dataset.name = data.first_name

            newChat.addEventListener('click', ()=>{
                openChat(newChat)
            })
            document.querySelector('.chat-div').append(newChat)
            chatBtns.push(newChat)
            openChat(newChat)
        }
        else{
            const newChat = chatBtns.find(button => button.dataset.id == data.chat_id);
            openChat(newChat)
        }
    })
})

photosBtn.forEach(btn => {
    btn.addEventListener('click', ()=>{
        imagesBtn.click()
    })
})


chatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        openChat(btn)
    })
})

sendMsg.addEventListener("click", ()=>{
    chatSocket.send(
        JSON.stringify({
            "msg": msgInput.value
        })
    )
    msgInput.value = ''
})


chatButton.addEventListener("click", ()=>{
    chatCreateDiv.style.display = "flex"
})

listCloseChat.forEach(button => {
    button.addEventListener("click", ()=>{
        chatCreateDiv.style.display = "none"
    })
});

listCloseChatSettings.addEventListener("click", ()=>{
    chatSettingsDiv.style.display = "none"
})

nextChatButton.addEventListener("click", ()=>{
    selectedUsersContainer.innerHTML = ""

    const selectedUsers = [...userCheckboxes]
        .filter(cb => cb.checked)

    selectedUsers.forEach(cb => {
        const userDiv = document.createElement("div")
        const userP = document.createElement("p")
        userP.textContent = cb.parentElement.textContent.trim()
        userDiv.appendChild(userP)
        userDiv.dataset.id = cb.dataset.id

        const deleteUserBtn = document.createElement("button")
        deleteUserBtn.type = 'button'

        const photo_img = document.createElement('img')
        photo_img.src = DELETE_USER
        deleteUserBtn.appendChild(photo_img)

        deleteUserBtn.addEventListener("click", ()=>{
            const checkbox = document.querySelector(
                `input[type="checkbox"][data-id="${userDiv.dataset.id}"]`
            );

            if (checkbox) {
                checkbox.checked = false;
            }

            userDiv.remove()
            deleteUserBtn.remove()
            
        })
        
        selectedUsersContainer.appendChild(userDiv)
        userDiv.appendChild(deleteUserBtn)
    })
    
    chatCreateDiv.style.display = "none"
    chatSettingsDiv.style.display = "flex"
})

backChatButton.addEventListener("click", ()=>{
    chatCreateDiv.style.display = "flex"
    chatSettingsDiv.style.display = "none"
})