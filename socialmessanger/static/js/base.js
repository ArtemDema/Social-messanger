const url = window.location.href

const homeLink = document.querySelector(".home-link")
const postLink = document.querySelector(".posts-link")
const friendsLink = document.querySelector(".friends-link")
const settingsLink = document.querySelector(".settings-link")

if (url.includes("/")){
    homeLink.classList.add('select')
    postLink.classList.remove('select')
    friendsLink.classList.remove('select')
    settingsLink.classList.remove('select')
}
if (url.includes("/post")){
    postLink.classList.add('select')
    homeLink.classList.remove('select')
    friendsLink.classList.remove('select')
    settingsLink.classList.remove('select')
}
if (url.includes("/friends")){
    friendsLink.classList.add('select')
    postLink.classList.remove('select')
    homeLink.classList.remove('select')
    settingsLink.classList.remove('select')
}
if (url.includes("/settings")){
    settingsLink.classList.add('select')
    postLink.classList.remove('select')
    friendsLink.classList.remove('select')
    homeLink.classList.remove('select')
}