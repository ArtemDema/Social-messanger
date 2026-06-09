const chatButton = document.querySelector(".create-chat-btn")

const chatCreateDiv = document.querySelector(".create-group-modal")
const chatSettingsDiv = document.querySelector(".settings-group-modal")

const listCloseChat = document.querySelectorAll(".close-create-chat-modal")
const listCloseChatSettings = document.querySelector(".close-settings-chat-modal")

const nextChatButton = document.querySelector(".next-create-chat-modal")
const backChatButton = document.querySelector(".back-create-chat-modal")

const selectedUsersContainer = document.querySelector(".selected-users")

const userCheckboxes = chatCreateDiv.querySelectorAll("input[type='checkbox']")

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
        const userDivAvatar = `
            <div class="user-item-div">
                <div class="profile-img"></div>
                <h4>${ cb.parentElement.textContent.trim() }</h4>
            </div>            
        `
        userDiv.innerHTML += userDivAvatar
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

createGroup.addEventListener('click', async()=> {
    const selectedUsers = [...userCheckboxes].filter(cb => cb.checked)
    
    const data = {
        'name': groupName.value,
        'friends': []
    }
    
    selectedUsers.forEach(selectedUser => {
        data.friends.push(selectedUser.dataset.id)
    })

    const response = await fetch(
        '/chat/create/group/',
        {
            headers: {
                'X-CSRFToken' : csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            method: 'POST',
            body: JSON.stringify(data)
        }
    )
    const responseData = await response.json()
    chatCreateDiv.style.display = 'none'
    chatSettingsDiv.style.display = 'none'

    const newChat = document.createElement("div")
    const newChatContent = document.createElement("div")
    const profileImg = document.createElement("div")
    const chatName = document.createElement("h3")

    newChatContent.classList.add("chat-div-user")
    profileImg.classList.add("profile-img")
    chatName.textContent = responseData.name

    newChat.dataset.id = String(responseData.chat_id)
    newChat.dataset.name = responseData.name
    newChat.classList.add("chat")
    
    newChat.addEventListener("click", ()=>{
        openChat(String(responseData.chat_id))
    })

    newChatContent.appendChild(profileImg)
    newChatContent.appendChild(chatName)
    newChat.appendChild(newChatContent)

    groupChats.appendChild(newChat)
    chatBtns.push(newChat)
})

backChatButton.addEventListener("click", ()=>{
    chatCreateDiv.style.display = "flex"
    chatSettingsDiv.style.display = "none"
})