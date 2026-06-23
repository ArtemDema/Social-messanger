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
    if(data.remove){
        button.closest('.card').remove()
    }
    if(data.text){
        button.closest('.card').innerHTML += `<p>${data.text}</p>`
    }
    if(data.friend_html){
        const cardFriends = document.getElementById('card-friends')
        if(cardFriends.querySelectorAll('.card').length < 6){
            cardFriends.insertAdjacentHTML('beforeend', data.friend_html)
            createActionButtonEvent()
        }
    }
}

async function redirectFriendAction(button) {
    window.location.href = button.dataset.profile
}

document.addEventListener('click', async function(event) {
    const button = event.target.closest('.friend-action-btn');

    if (!button) return; 

    if (button.dataset.profile) {
        window.location.href = button.dataset.profile;
    }

    if (button.dataset.url) {
        hendleFriendAction(button)
    }
});