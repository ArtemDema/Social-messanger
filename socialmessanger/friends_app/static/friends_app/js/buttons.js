const sectionButtons = document.querySelectorAll("[data-section-link]")
const allSections = document.querySelector('.main-cnt')

const currentSection = document.querySelector('#current-section')
const currentSectionList = document.querySelector('#current-section-list')
const currentSectionLoadLine = document.querySelector('#current-section-load-line')

const sectionSideButtons = document.querySelectorAll('.settings-button')

const titles = {
    requests: 'Запити',
    recommendations: "Рекомендації",
    friends: "Всі друзі"
}

let currentSectionName = ''
let currentPage = 1
let hasNext = false
let isLoading = false

function setActiveButton(activeButton){
    sectionButtons.forEach((button)=>{
        button.classList.remove('select-button')
    })

    activeButton.classList.add('select-button')
}

async function loadSection(section, page) {
    isLoading = true
    const response = await fetch(`/friends/${section}/?page=${page}`, {headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }})
    const data = await response.json()
    hasNext = data.has_next
    if (hasNext == false){
        friendsObserver.disconnect()
    }
    currentSectionList.insertAdjacentHTML('beforeend', data.html)
    isLoading = false
}

async function openSection(section){
    currentSectionName = section
    allSections.style.display = 'none'
    currentSection.style.display = 'flex'
    currentPage = 1
    currentSectionList.innerHTML = ""

    const h_two = `<h2>${titles[section]}</h2>`
    const htmlString = `<div class="section-top">
                            ${h_two}
                        </div>`
    currentSectionList.insertAdjacentHTML('beforeend', htmlString)

    friendsObserver.observe(currentSectionLoadLine)
    await loadSection(section, currentPage)
}

const friendsObserver = new IntersectionObserver(async (entries)=>{
    if (entries[0].isIntersecting && isLoading == false && hasNext == true){
        currentPage += 1
        await loadSection(currentSectionName, currentPage)
    }
}, {
    rootMargin: "80px"
})

sectionButtons.forEach((sectionButton) => {
    sectionButton.addEventListener('click', async function(){
        setActiveButton(sectionButton)

        if (sectionButton.dataset.sectionLink == 'main'){
            allSections.style.display = 'flex'
            currentSection.style.display = 'none'
            return
        }

        sectionSideButtons.forEach((sectionSideButton) => {
            if (sectionSideButton.dataset.sectionLink == sectionButton.dataset.sectionLink){
                sectionSideButton.classList.add('select-button')
            }
        })
        
        await openSection(sectionButton.dataset.sectionLink)
    })
})