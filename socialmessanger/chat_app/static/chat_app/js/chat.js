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

const currentUserId = document.getElementById('current-user').dataset.id;

const messages = document.querySelector('#messages')
const loadLine = document.querySelector("#load-message-line")
let pageNumber = 1
let observer = null
let chatId;

async function loadMessages(){
    const response = await fetch(
        `/chat/${chatId}/getMessages/?page=${pageNumber}`,
        {headers: {'X-Requested-With': 'XMLHttpRequest'}}
    )
    const data = await response.json()
    
    if (data.success){
        data.messages.forEach((message)=>{
            createMessage(message.sender, message.text, message.date, message.time, message.is_author, false)
        })
        createDateMessage()
    }else if (observer != null){
        observer.disconnect()
    }
}

function createMessage(sender, text, date, time, is_author, isNew = true){
    const newMessage = document.createElement('div')
    newMessage.classList.add('message')
    if (is_author){
        newMessage.classList.add('div-own-msg')
        newMessage.innerHTML = `
        <div class="user-message own-message" data-date="${date}">
            <h4 class="text">${text}</h4>
            <h6 class="date-time">${time}</h6>
        </div>
        `
    }
    else{
        newMessage.innerHTML = `
        <div class="profile-img"></div>
        <div class="user-message">
            <h5 class="sender">${sender}</h5>
            <h4 class="text">${text}</h4>
            <h6 class="date-time">${time}</h6>
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


function openChat(id){
    let chatById = null
    chatBtns.forEach(tab => {
        if (tab.dataset.id === id) {
            chatById = tab
        }
    });
    const others = chatBtns.filter(button => button !== chatById);
    others.forEach(otherBtn => {
        otherBtn.classList.remove('selected-chat');
    });

    notSelectContainer.style.display = "none"
    chatDiv.style.display = "flex"

    messages.querySelectorAll(".message").forEach((msg) =>{
        msg.remove()
    })

    pageNumber = 1
    chatId = id
    loadMessages().then(()=>{
        messages.scrollTop = messages.scrollHeight
        startObserveMessage()
    })
    
    chatName.innerHTML = ""
    const chatNameH = document.createElement('h2')
    chatNameH.textContent = chatById.dataset.name
    chatName.appendChild(chatNameH)

    chatById.classList.add('selected-chat')
    
    if (chatSocket){
        chatSocket.close()
    }
    let url = `ws://${window.location.host}/chat/${id}`;
    chatSocket = new WebSocket(url)
    chatSocket.onmessage = (event)=>{
        const data = JSON.parse(event.data)

        if (data.message){
            const isAuthor = data.message.sender_id == currentUserId;
            createMessage(data.message.sender, data.message.text, data.message.date, data.message.time, isAuthor);
            messages.scrollTop = messages.scrollHeight
            createDateMessage()
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
            const newChatDiv = document.createElement('div')

            newChat.classList.add('chat')
            newChatDiv.classList.add('chat-div-user')
            
            let userStatus = OFFLINE_IMAGE
            if (data.is_online == true){
                userStatus = ONLINE_IMAGE
            }

            newChatDiv.innerHTML = `<div class="profile-img">
                                        <img src="${userStatus}" alt="" class="status">
                                    </div>`
            newChatDiv.innerHTML += `<h3>${data.first_name}</h3>`

            newChat.dataset.id = data.chat_id
            newChat.dataset.name = data.first_name
            newChat.appendChild(newChatDiv)

            newChat.addEventListener('click', ()=>{
                openChat(newChat.dataset.id)
            })
            document.querySelector('.chat-div').append(newChat)
            chatBtns.push(newChat)
            openChat(newChat.dataset.id)
        }
        else{
            const newChat = chatBtns.find(button => button.dataset.id == data.chat_id);
            openChat(newChat.dataset.id)
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
        if (chatId != btn.dataset.id){
            openChat(btn.dataset.id)
        }
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

async function startObserveMessage(chat){
    observer = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting){
            pageNumber += 1
            await loadMessages()
        }
    }, {rootMargin: "10px"})
    observer.observe(loadLine)
}

function createDateMessage(){
    const messageDates = document.querySelectorAll('.message-date')
    messageDates.forEach(date => {
        date.remove()
    })

    const messageList = document.querySelectorAll('.user-message')
    let previousMessageDate = null
    messageList.forEach(message => {
        if(previousMessageDate != message.dataset.date){
            const dateTitleDiv = document.createElement('div')
            dateTitleDiv.classList.add("date-title-div")

            const dateTitleDivForCenter = document.createElement('div')
            dateTitleDivForCenter.classList.add("date-title-for-center")
            dateTitleDiv.appendChild(dateTitleDivForCenter)

            const dateTitle = document.createElement('h4')
            dateTitle.classList.add('message-date')
            dateTitle.textContent = message.dataset.date
            dateTitleDivForCenter.appendChild(dateTitle)

            messages.insertBefore(dateTitleDiv, message.parentElement)
        }
        previousMessageDate = message.dataset.date
    })
}