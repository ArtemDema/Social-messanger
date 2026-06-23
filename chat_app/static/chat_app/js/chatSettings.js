const settingsButton = document.querySelector("#settings-chat-button")
const settingsModal = document.querySelector(".chat-settings")
const closeModalSettings = document.querySelector(".close-button")
const realModalSettings = document.querySelector(".edit-group-modal")
const editModal = document.querySelector(".edit")
const editUsersDiv = document.querySelector(".users")
const addUsersToGroup = document.querySelector(".add-to-group")
const addUsersToGroupModal = document.querySelector(".add-to-group-modal")
const addUsersToGroupModalBtn = document.querySelector(".add-users-to-group-btn")
const userCheckboxesAdd = addUsersToGroupModal.querySelectorAll("input[type='checkbox']")
const currentGroupName = document.querySelector(".current-group-name")
const confirmEditGroup = document.querySelector(".edit-group-btn")
const backAddMember = document.querySelectorAll(".close-add-to-chat-modal")
const closeEditGroup = document.querySelectorAll(".close-edit-chat-modal")
const settingsMemberModal = document.querySelector(".chat-settings-member")
const closeSettingsMemberModal = document.querySelector(".close-button-member")
const deleteBtn = document.querySelector(".delete")
const deleteAdminBtn = document.querySelector(".delete-admin")
const errorContainerEdit = document.querySelector("#error-edit-group")


let editChatId = 0;
let editChatName = null;
let listEditGroupUsers = []
let listEditGroupUsersId = []

settingsButton.addEventListener("click", async () =>{
    const chatNowId = document.querySelector(".selected-chat").dataset.id
    const responce = await fetch(`/chat/${ chatNowId }/getGroupUsers/`)
    const data = await responce.json()
    if(data.success){
        if(currentUserId == data.admin){
            settingsModal.classList.add("open")
        }
        else{
            settingsMemberModal.classList.add("open")
        }
    }
})

deleteBtn.addEventListener("click", async () =>{
    chatBtns.forEach(tab => {
        if (tab.classList == "chat selected-chat") {
            editChatId = tab.dataset.id
        }
    })

    const formData = new FormData()
    formData.append("to_delete", currentUserId)
    formData.append("id_chat", editChatId)

    const responce = await fetch('/chat/deleteGroup/', {
        method: "POST",
        headers: {
            'X-CSRFToken' : csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        }, 
        body: formData
    })
    const data = await responce.json()
    if(data.success){
        settingsMemberModal.classList.remove('open')
    }
})

deleteAdminBtn.addEventListener("click", async () =>{
    chatBtns.forEach(tab => {
        if (tab.classList == "chat selected-chat") {
            editChatId = tab.dataset.id
        }
    })

    const formData = new FormData()
    formData.append("to_delete", 'all')
    formData.append("id_chat", editChatId)

    const responce = await fetch('/chat/deleteGroup/', {
        method: "POST",
        headers: {
            'X-CSRFToken' : csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        }, 
        body: formData
    })
    const data = await responce.json()
    if(data.success){
        settingsModal.classList.remove('open')
    }
})


closeSettingsMemberModal.addEventListener("click", () =>{
    settingsMemberModal.classList.remove('open')
})


closeModalSettings.addEventListener("click", () =>{
    settingsModal.classList.remove('open')
})

backAddMember.forEach(member => {
    member.addEventListener("click",() =>{
        addUsersToGroupModal.style.display = "none"
        realModalSettings.style.display = "flex"
    })
})

closeEditGroup.forEach(member => {
    member.addEventListener("click",() =>{
        realModalSettings.style.display = "none"
    })
})

editModal.addEventListener("click", async () =>{
    settingsModal.classList.remove('open')

    chatBtns.forEach(tab => {
        if (tab.classList == "chat selected-chat") {
            editChatId = tab.dataset.id
            editChatName = tab.dataset.name
        }
    });
    
    const responce = await fetch(`/chat/${editChatId}/getGroupUsers/`)
    const data = await responce.json()
    if (data.success){
        listEditGroupUsers = data.users_name
        listEditGroupUsersId = data.users_id

        currentGroupName.value = data.name

        editUsersDiv.textContent = ""
        let count = 0
        listEditGroupUsers.forEach(user => {  
            if(currentUserId != listEditGroupUsersId[count]){
                const userDiv = document.createElement("div")
                const userDivAvatar = `
                    <div class="user-item-div">
                        <div class="profile-img"></div>
                        <h4>${ user }</h4>
                    </div>            
                `
                userDiv.innerHTML += userDivAvatar
                userDiv.classList.add('member')
                userDiv.dataset.id = listEditGroupUsersId[count]

                const deleteUserBtn = document.createElement("button")
                deleteUserBtn.type = 'button'

                const photo_img = document.createElement('img')
                photo_img.src = DELETE_USER
                deleteUserBtn.appendChild(photo_img)

                deleteUserBtn.addEventListener("click", ()=>{
                    const checkbox = document.querySelector(
                        `input[type="checkbox"][data-id="${userDiv.dataset.id}"]`
                    )

                    if (checkbox) {
                        checkbox.checked = false;
                    }

                    userDiv.remove()
                    deleteUserBtn.remove()
                    
                })
                
                editUsersDiv.appendChild(userDiv)
                userDiv.appendChild(deleteUserBtn)
            }
            count += 1
        })
    }
    realModalSettings.style.display = "flex"
})

addUsersToGroup.addEventListener("click", () =>{
    realModalSettings.style.display = "none"
    addUsersToGroupModal.style.display = "flex"
})

addUsersToGroupModalBtn.addEventListener('click', ()=>{
    const selectedUsers = [...userCheckboxesAdd].filter(cb => cb.checked).filter(cb => !listEditGroupUsersId.includes(Number(cb.dataset.id)))

    selectedUsers.forEach(cb => {
        const userDiv = document.createElement("div")
        const userDivAvatar = `
            <div class="user-item-div">
                <div class="profile-img"></div>
                <h4>${ cb.parentElement.textContent.trim() }</h4>
            </div>            
        `
        userDiv.innerHTML += userDivAvatar
        userDiv.classList.add('member')
        userDiv.dataset.id = cb.dataset.id

        const deleteUserBtn = document.createElement("button")
        deleteUserBtn.type = 'button'

        const photo_img = document.createElement('img')
        photo_img.src = DELETE_USER
        deleteUserBtn.appendChild(photo_img)

        deleteUserBtn.addEventListener("click", ()=>{
            const checkbox = document.querySelector(
                `input[type="checkbox"][data-id="${userDiv.dataset.id}"]`
            )

            if (checkbox) {
                checkbox.checked = false;
            }

            userDiv.remove()
            deleteUserBtn.remove()
            
        })
        
        editUsersDiv.appendChild(userDiv)
        userDiv.appendChild(deleteUserBtn)
    })

    realModalSettings.style.display = "flex"
    addUsersToGroupModal.style.display = "none"
})

confirmEditGroup.addEventListener('click', async () =>{
    const currentMembers = [...document.querySelectorAll('.member')]
    const currentMembersId = []

    currentMembers.forEach(member =>{
        currentMembersId.push(member.dataset.id)
    })
    currentMembersId.push(currentUserId)

    const currentName = currentGroupName.value
    
    if (Array.from(currentName).length <= 20 && Array.from(currentName).length >= 4){
        if (currentMembers.length >= 2){
            errorContainerEdit.textContent = ''

            const formData = new FormData()

            formData.append("id_members", currentMembersId)
            formData.append("group_name", currentName)
            formData.append("id_group", editChatId)

            const responce = await fetch('/chat/editGroup/', {
                method: "POST",
                headers: {
                    'X-CSRFToken' : csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                }, 
                body: formData
            })
            realModalSettings.style.display = "none"

            document.querySelector('.selected-chat .chat-info-div h3').textContent = currentName
            document.querySelector('.selected-chat').dataset.name = currentName
            document.querySelector('.chat-name h2').textContent = currentName
            document.querySelector('.chat-name p').remove()
            getGroupUsers(editChatId)
        }
        else{
            errorContainerEdit.textContent = 'В групі має бути не менше 2 учасників'
        }
    }
    else{
        errorContainerEdit.textContent = 'Назва групи має бути від 4 до 20 символів'
    }
})