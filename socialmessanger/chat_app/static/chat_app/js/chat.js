const chatBtns = [...document.querySelectorAll(".chat")];
const chatDiv = document.querySelector("#chat")
const notSelectContainer = document.querySelector(".not-select")
let chatSocket;

const sendMsg = document.querySelector("#send-msg")
const msgInput = document.querySelector("#msg-input")
const groupHeader = document.querySelector("#name-div")

const photosBtn = document.querySelectorAll(".photo")
const imagesBtn = document.querySelector("#id_images")

const chatName = document.querySelector(".chat-name") 

const friendDivs = document.querySelectorAll(".user-friends-div")
const csrfToken = document.querySelector("meta[name='csrf_token']").content

const currentUserId = document.getElementById('current-user').dataset.id

const msgImageInput = document.querySelector("#message-files")

const messages = document.querySelector('#messages')
const loadLine = document.querySelector("#load-message-line")
const unreadedMessageDiv = document.querySelector(`.main-unread-indiv`)
const unreadedMessageDivGroup = document.querySelector(`.main-unread-group`)

let pageNumber = 1
let observer = null
let chatId;

let listOnlineGroupUsers = null
let listGroupUsers = null

const sendImg = document.querySelector('#send-image')

const groupChats = document.querySelector('.chat-div-group')

const backChat = document.querySelector("#back-from-chat")

backChat.addEventListener('click', ()=>{
    chatDiv.style.display = "none"
    notSelectContainer.style.display = "flex"
    if (chatSocket) chatSocket.close()
    chatId = null

    chatBtns.forEach(otherBtn => {
        otherBtn.classList.remove('selected-chat');
    });
})

sendImg.addEventListener('click', ()=>{
    msgImageInput.click()
})

function updateGroupUsers(id, status){
    if (listGroupUsers != null){
        if (listGroupUsers.includes(id)){
            if (status == false && listOnlineGroupUsers.includes(id)){
                listOnlineGroupUsers.splice(listOnlineGroupUsers.indexOf(id), 1)
            }
            else if (!listOnlineGroupUsers.includes(id)){
                listOnlineGroupUsers.push(id)
            }
            groupHeader.querySelector("p").textContent = `${listGroupUsers.length} учасники, ${listOnlineGroupUsers.length} в мережі`
        } 
    }
}

async function getGroupUsers(id){ 
    listOnlineGroupUsers = null
    listGroupUsers = null

    const response = await fetch(`/chat/${id}/getGroupUsers/`)
    const data = await response.json()
    if (data.success){
        listGroupUsers = data.users_id
        listOnlineGroupUsers = data.online_users_id

        document.querySelector(".chat-name").innerHTML += `
            <p>${data.users_id.length} учасники, ${data.online_users_id.length} в мережі</p>
        `

    }
}

function renderCountUnreadedMessages(){
    for (const containerName of ["chat-div"]){
        const unreadeds = document.querySelectorAll(`.${containerName} .unread`)
        
        let globalCount = 0
        unreadeds.forEach(unreaded => {
            globalCount += Number(unreaded.textContent)
        })
        
        if (globalCount > 0){
            unreadedMessageDiv.classList.add('open')
            unreadedMessageDiv.innerHTML = `${globalCount}`
        }else{
            unreadedMessageDiv.classList.remove('open')
            unreadedMessageDiv.innerHTML = ``
        }
    }
     for (const containerName of ["chat-div-group"]){
        const unreadeds = document.querySelectorAll(`.${containerName} .unread`)
        
        let globalCount = 0
        unreadeds.forEach(unreaded => {
            globalCount += Number(unreaded.textContent)
        })
        
        if (globalCount > 0){
            unreadedMessageDivGroup.classList.add('open')
            unreadedMessageDivGroup.innerHTML = `${globalCount}`
        }else{
            unreadedMessageDivGroup.classList.remove('open')
            unreadedMessageDivGroup.innerHTML = ``
        }
    }

}

renderCountUnreadedMessages()

async function loadMessages(){
    const oldHeight = messages.scrollHeight
    
    const response = await fetch(
        `/chat/${chatId}/getMessages/?page=${pageNumber}`,
        {headers: {'X-Requested-With': 'XMLHttpRequest'}}
    )
    const data = await response.json()
    
    if (data.success){
        data.messages.forEach((message)=>{
            createMessage(message.sender, message.text, message.date, message.time, message.is_author, message.images, false)
        })
        createDateMessage()

        if(pageNumber > 1){
            const newHeight = messages.scrollHeight
            messages.scrollTop += (newHeight - oldHeight)
        }

    }else if (observer != null){
        observer.disconnect()
    }
}

function createMessage(sender, text, date, time, is_author, images, isNew = true){
    const newMessage = document.createElement('div')
    newMessage.classList.add('message')
    if (is_author){
        if (text.length == 0){
            text = "фото без підпису"
        }
        newMessage.classList.add('div-own-msg')
        newMessage.innerHTML = `
        <div style="display: flex; width: 100%; flex-direction: row; justify-content: right;">
            <div class="user-message own-message" data-date="${date}">
                <h4 class="text">${text}</h4>
                <h6 class="date-time">${time}</h6>
            </div>
        </div>
        `
    }
    else{
        newMessage.innerHTML = `
        <div class = 'message-info'>
            <div class="profile-img"></div>
            <div class="user-message">
                <h5 class="sender">${sender}</h5>
                <h4 class="text">${text}</h4>
                <h6 class="date-time">${time}</h6>
            </div>
        </div>
        `
    }

    if (images.length != 0){
        images.forEach(imageUrl =>{
            const newImage = document.createElement("img")
            newImage.classList.add('chat-image')
            newImage.src = imageUrl
            newMessage.append(newImage)
        })
    }

    if(isNew){
        messages.appendChild(newMessage)
    }
    else{
        messages.insertBefore(newMessage, loadLine.nextElementSibling)
    }
}

function openChat(id){
    settingsModal.classList.remove('open')
    if (observer != null) {
        observer.disconnect();
        observer = null;
    }

    let chatById = null
    chatBtns.forEach(tab => {
        
        if (tab.dataset.id == id) {
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
    
    getGroupUsers(id)
    if (chatSocket){
        chatSocket.close()
    }
    
    const selectedChat = document.querySelector(`.selected-chat`)
    const unreadCount = selectedChat.querySelector('.unread')
    if (unreadCount){
        unreadCount.remove()
    }
    
    renderCountUnreadedMessages()

    let url = `ws://${window.location.host}/chat/${id}`;
    chatSocket = new WebSocket(url)
    chatSocket.onmessage = (event)=>{
        const data = JSON.parse(event.data)

        if (data.message){
            const isAuthor = data.message.sender_id == currentUserId;
            createMessage(data.message.sender, data.message.text, data.message.date, data.message.time, isAuthor,  data.message.images);
            messages.scrollTop = messages.scrollHeight
            createDateMessage()
        }
    }
}

async function startObserveMessage() {
    if (observer) {
        observer.disconnect()
    }

    observer = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting){
            pageNumber += 1
            await loadMessages()
        }
    }, {rootMargin: "10px"})
    observer.observe(loadLine)
}

function createDateMessage(){
    const messageDates = document.querySelectorAll('.date-title-div')
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

            messages.insertBefore(dateTitleDiv, message.parentElement.parentElement)
        }
        previousMessageDate = message.dataset.date
    })
}

sendMsg.addEventListener("click", async ()=>{
    if (msgImageInput.files.length > 0){
        const formData = new FormData()
        formData.append("text", msgInput.value)
        formData.append("chat_id", chatId )

        const files = Array.from(msgImageInput.files)
        files.forEach(file =>{
            formData.append("image", file) 
        })

        const response = await fetch('/chat/create/message/', {
            method: "POST",
            headers: {
                'X-CSRFToken' : csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        })
    }else{
        chatSocket.send(
            JSON.stringify({
                "msg": msgInput.value
            })
        )
    }
    msgInput.value = ''
    msgImageInput.value = ''
})

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

            newChatDiv.innerHTML = `<div class="profile-img">
                                        <div class="online-marker data-id=${div.dataset.id}"></div>
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