const chatBtns = document.querySelectorAll(".chat")
const chat = document.querySelector("#main-block-chat")
const notSelectContainer = document.querySelector("#not-select")
let chatSocket;

const sendMsg = document.querySelector("#send-msg")
const msgInput = document.querySelector("#msg-input")

chatBtns.forEach(btn => {
    btn.addEventListener('click', ()=>{
        notSelectContainer.style.display = "none"
        chat.style.display = "flex"
        if (chatSocket){
            chatSocket.close()
        }
        let chatId = btn.dataset.id
        let url = `ws://${window.location.host}/chat/${chatId}`;
        chatSocket = new WebSocket(url)
        chatSocket.onmessage = (event)=>{
            const data = JSON.parse(event.data)
            console.log(data);
            
        }
    })
})

sendMsg.addEventListener("click", ()=>{
    chatSocket.send(
        JSON.stringify({
            "msg": msgInput.value
        })
    )
    msgInput.value = ''
})