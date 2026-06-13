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
 
let editChatId = 0;
let editChatName = null;

settingsButton.addEventListener("click", () =>{
    settingsModal.classList.add("open")
})

closeModalSettings.addEventListener("click", () =>{
    settingsModal.classList.remove('open')
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
        const listEditGroupUsers = data.users_name
        const listEditGroupUsersId = data.users_id

        currentGroupName.value = data.name

        let count = 0
        listEditGroupUsers.forEach(user => {
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
                );

                if (checkbox) {
                    checkbox.checked = false;
                }

                userDiv.remove()
                deleteUserBtn.remove()
                
            })
            
            editUsersDiv.appendChild(userDiv)
            userDiv.appendChild(deleteUserBtn)
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
    const selectedUsers = [...userCheckboxesAdd].filter(cb => cb.checked)

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
            );

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
    realModalSettings.style.display = "none"
    
    const currentMembers = [...document.querySelectorAll('.member')]
    const currentMembersId = []

    currentMembers.forEach(member =>{
        currentMembersId.push(member.dataset.id)
    })

    const currentName = currentGroupName.value

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
    
})