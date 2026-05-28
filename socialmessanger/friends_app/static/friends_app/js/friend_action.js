const csrfToken = document.querySelector("meta[name='csrf_token']").content

async function redirectFriendAction(button) {
    window.location.href = button.dataset.profile
}

document.addEventListener('click', async function(event) {
    const button = event.target.closest('.friend-action-btn');
    
    if (!button) return; 

    if (button.dataset.profile) {
        window.location.href = button.dataset.profile;
    }
});