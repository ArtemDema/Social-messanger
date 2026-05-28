const chatBtns = [...document.querySelectorAll(".chat")];
const chat = document.querySelector("#chat")
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

function openChat(chatId){
    notSelectContainer.style.display = "none"
    chat.style.display = "flex"
    if (chatSocket){
        chatSocket.close()
    }
    let url = `ws://${window.location.host}/chat/${chatId}`;
    chatSocket = new WebSocket(url)
    chatSocket.onmessage = (event)=>{
        const data = JSON.parse(event.data)
        console.log(data);
        
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
            newChat.innerHTML = `<h3>${data.friend_email}</h3>`
            newChat.dataset.id = data.chat_id
            newChat.addEventListener('click', ()=>{
                openChat(data.chat_id)
            })
            document.querySelector('.chat-div').append(newChat)
        }
        openChat(data.chat_id)
    })
})

photosBtn.forEach(btn => {
    btn.addEventListener('click', ()=>{
        imagesBtn.click()
    })
})

chatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const others = chatBtns.filter(button => button !== btn);
        others.forEach(otherBtn => {
            otherBtn.classList.remove('selected-chat');
        });

        notSelectContainer.style.display = "none"
        chat.style.display = "flex"
        
        chatName.innerHTML = ""
        const chatNameH = document.createElement('h2')
        chatNameH.textContent = btn.dataset.name
        chatName.appendChild(chatNameH)

        btn.classList.add('selected-chat')
        
        if (chatSocket){
            chatSocket.close()
        }
        let chatId = btn.dataset.id
        let url = `ws://${window.location.host}/chat/${chatId}`;
        chatSocket = new WebSocket(url)
        chatSocket.onmessage = (event)=>{
            const data = JSON.parse(event.data)
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