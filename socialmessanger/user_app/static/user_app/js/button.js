const btnInfo = document.querySelector('#my-info-btn')
const btnAlbum = document.querySelector('#album-btn')

const cntInfo = document.querySelector('#my-info-cnt')
const cntAlbum = document.querySelector('#album-cnt')

btnInfo.addEventListener('click', () => {
    cntAlbum.classList.add('hidden')
    cntInfo.classList.remove('hidden')
    }
)

btnAlbum.addEventListener('click', () => {

    cntAlbum.classList.remove('hidden')
    cntInfo.classList.add('hidden')
    }
)