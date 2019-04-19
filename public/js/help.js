const name = document.querySelector('#name')
const email = document.querySelector('#email')
const text = document.querySelector('#text')
const emailForm = document.querySelector('#emailForm')
const submitBtn = document.querySelector('#submitBtn')
const sendingGif = document.querySelector('#sendingGif')
const card = document.querySelector('#card')

//the line below gets the the url of the page. It's done to make the requesto to the correct url
//when the app is in development, the url is different from when it's in production that's why
//the url is caught dynamically
const url = `${window.location.href}`
console.log(url)

emailForm.addEventListener('submit', (e) => {
    e.preventDefault()
    controlForm(true)
    sendingGif.style.display = "inline"
    fetch(`${url}/email?name=${name.value}&email=${email.value}&text=${text.value}`)
    .then((response) => {
       response.json().then((data) => {
            if(data.error){
                sendingGif.style.display = "none"
                controlForm(false)
                showCard('errorCard', data.error)
            }else{
                console.log(data.res);
                sendingGif.style.display = "none"
                controlForm(false)
                showCard('successCard', data.res)
            }
        })
    })
    name.value = ""
    email.value = ""
    text.value = ""
})

controlForm = (option) => {
    name.disabled = option
    email.disabled = option
    text.disabled = option
    submitBtn.disabled = option
}

showCard = (cardClass, text) => { 
    card.className = cardClass
    card.style.display = "block"
    card.childNodes[1].textContent = text
    setTimeout(() => {
        card.style.display = "none";
    }, 3000)
}