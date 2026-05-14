const btnMain = document.querySelector('#main-btn')
const btnRequests = document.querySelector('#requests-btn')
const btnRecomendations = document.querySelector('#recomendations-btn')
const btnAllFriends = document.querySelector('#all-friends-btn')

const cntMain = document.querySelector('.main-cnt')
const cntRequests = document.querySelector('.requests-cnt')
const cntRecomendations = document.querySelector('.recomendations-cnt')
const cntAllFriends = document.querySelector('.all-friends-cnt')


btnMain.addEventListener('click', () => {
    btnMain.classList.add('select-button')
    btnRequests.classList.remove('select-button')
    btnRecomendations.classList.remove('select-button')
    btnAllFriends.classList.remove('select-button')
    

    cntMain.classList.remove('hidden')
    cntRequests.classList.add('hidden')
    cntRecomendations.classList.add('hidden')
    cntAllFriends.classList.add('hidden')
    }
)

btnRequests.addEventListener('click', () => {
    btnRequests.classList.add('select-button')
    btnMain.classList.remove('select-button')
    btnRecomendations.classList.remove('select-button')
    btnAllFriends.classList.remove('select-button')


    cntRequests.classList.remove('hidden')
    cntMain.classList.add('hidden')
    cntRecomendations.classList.add('hidden')
    cntAllFriends.classList.add('hidden')
    }
)

btnRecomendations.addEventListener('click', () => {
    btnRequests.classList.remove('select-button')
    btnMain.classList.remove('select-button')
    btnRecomendations.classList.add('select-button')
    btnAllFriends.classList.remove('select-button')


    cntMain.classList.add('hidden')
    cntRequests.classList.add('hidden') 
    cntAllFriends.classList.add('hidden')
    cntRecomendations.classList.remove('hidden')
    }
)

btnAllFriends.addEventListener('click', () => {
    btnAllFriends.classList.add('select-button')
    btnMain.classList.remove('select-button')
    btnRecomendations.classList.remove('select-button')
    btnRequests.classList.remove('select-button')


    cntMain.classList.add('hidden')
    cntRequests.classList.add('hidden')
    cntRecomendations.classList.add('hidden')
    cntAllFriends.classList.remove('hidden')
    }
)