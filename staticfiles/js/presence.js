const presence_url = `wss://${window.location.host}/presence/`;
const presenceSocket = new WebSocket(presence_url)

presenceSocket.onmessage = (event) =>{
    const data = JSON.parse(event.data)

    const userMarkers = document.querySelectorAll(".online-marker")
    if (data.type == 'get_online'){
        userMarkers.forEach(marker => {
            if(marker.dataset.id in data.online_users){
                marker.classList.add('active-marker')
            }
            else{
                marker.classList.remove('active-marker')
            }
        })
    } 
    else if (data.type == 'send_message'){
        document.querySelectorAll('.chat').forEach(chat => {
            if (chat.dataset.id != chatId && Number(chat.dataset.id) === Number(data.chat_id)){
                // const lastMessageInfo = chat.querySelectorAll('.chat-last-message-info h5')
                // lastMessageInfo[0].textContent = 'Нове повідомлення'
                // lastMessageInfo[1].textContent = ''

                const unread = chat.querySelector('.unread')
                
                if(unread){
                    unread.textContent = Number(unread.textContent) + 1
                }else{
                    const newUnread = document.createElement('h6')
                    newUnread.classList.add('unread')
                    newUnread.textContent = 1

                    chat.querySelector('.chat-info-div').append(newUnread)
                }
                renderCountUnreadedMessages()
            }
        })

    }
    else{
       userMarkers.forEach(marker =>{
        if (marker.dataset.id == data.user_id){
            if(data.status){
                marker.classList.add('active-marker')
            }
            else{
                marker.classList.remove('active-marker')
            }
        }
        })
        try{
            updateGroupUsers(data.user_id, data.status)
        }
        catch{}
    }
}