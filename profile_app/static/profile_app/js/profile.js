const csrfToken = document.querySelector("meta[name='csrf_token']").content

async function hendleFriendAction(button) {
    const response = await fetch(button.dataset.url, {
        method: 'POST', 
        headers : {
            'X-CSRFToken' : csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
    })
    const data = await response.json()
    window.location.href = '/friends/'
}

function createActionButtonEvent(){
    const actionBtns = document.querySelectorAll('.friend-action-btn')
    actionBtns.forEach((actionBtn) => {
        actionBtn.addEventListener('click', async function(){
            await hendleFriendAction(actionBtn)
        })
    })
}

createActionButtonEvent()