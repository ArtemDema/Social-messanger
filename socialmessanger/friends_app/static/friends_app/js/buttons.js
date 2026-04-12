const btnMain = document.querySelector('#main-btn')
const btnRequests = document.querySelector('#requests-btn')
const btnRecomendations = document.querySelector('#recomendations-btn')
const btnAllFriends = document.querySelector('#all-friends-btn')

const cntMain = document.querySelector('#main-cnt')
const cntRequests = document.querySelector('#requests-cnt')
const cntRecomendations = document.querySelector('#recomendations-cnt')
const cntAllFriends = document.querySelector('#all-friends-cnt')


btnMain.addEventListener('click', () => {
    cntMain.classList.remove('hidden')
    cntRequests.classList.add('hidden')
    cntRecomendations.classList.add('hidden')
    cntAllFriends.classList.add('hidden')
    }
)

btnRequests.addEventListener('click', () => {

    cntRequests.classList.remove('hidden')
    cntMain.classList.add('hidden')
    cntRecomendations.classList.add('hidden')
    cntAllFriends.classList.add('hidden')
    }
)

btnRecomendations.addEventListener('click', () => {

    cntMain.classList.add('hidden')
    cntRequests.classList.add('hidden') 
    cntAllFriends.classList.add('hidden')
    cntRecomendations.classList.remove('hidden')
    }
)

btnAllFriends.addEventListener('click', () => {

    cntMain.classList.add('hidden')
    cntRequests.classList.add('hidden')
    cntRecomendations.classList.add('hidden')
    cntAllFriends.classList.remove('hidden')
    }
)