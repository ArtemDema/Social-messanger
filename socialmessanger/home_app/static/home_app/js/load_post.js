const loadPostLine = document.querySelector("#load-post-line")
const postList = document.querySelector("#post-list")
let page = 1

const observer = new IntersectionObserver(async (entries)=>{
    if (entries[0].isIntersecting){
        page ++
        const responce = await fetch(`/post/?page=${page}`,{
            headers: {"X-Requested-With": "XMLHttpRequest"}
        })

        const data = await responce.json()

        if (data.answer){
            loadPostLine.insertAdjacentHTML("beforebegin", data.html)
        }else{
            observer.disconnect()
        }
    }
}, {
    rootMargin: "200px"
})

observer.observe(loadPostLine)