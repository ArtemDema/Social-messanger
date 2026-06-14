const btnInfo = document.querySelector('#my-info-btn')
const btnAlbum = document.querySelector('#album-btn')

const cntInfo = document.querySelector('#my-info-cnt')
const cntAlbum = document.querySelector('#album-cnt')

btnInfo.addEventListener('click', () => {
    btnInfo.classList.add('select-button')
    btnAlbum.classList.remove('select-button')

    cntAlbum.classList.add('hidden')
    cntInfo.classList.remove('hidden')
    }
)

btnAlbum.addEventListener('click', () => {
    btnInfo.classList.remove('select-button')
    btnAlbum.classList.add('select-button')

    cntAlbum.classList.remove('hidden')
    cntInfo.classList.add('hidden')
    }
)