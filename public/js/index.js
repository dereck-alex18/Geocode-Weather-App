const form = document.querySelector("#locForm")
const address = document.querySelector("#address")
const addressLink = document.querySelector("#addressLink")
const temperature = document.querySelector("#temperature")
const apparentTemp = document.querySelector("#apparentTemp")
const summary = document.querySelector("#summary")
const weatherInformation = document.querySelector(".weatherInformation")
const loadingGif = document.querySelector("#loadingGif")
const errorCard = document.querySelector('.errorCard');
//the line below gets the the url of the page. It's done to make the requesto to the correct url
//when the app is in development, the url is different from when it's in production that's why
//the url is caught dynamically
const url = `${window.location.href}`

//as soon as the age is loaded, the user's location is fetched
document.addEventListener('DOMContentLoaded', getUsersLoc)

form.addEventListener('submit', (e) => {
    e.preventDefault() //prevent the form's default behavior
    const location = document.querySelector("#location").value //get what was written in the form
    loadingGif.style.display = "inline" //show the loading gif until the data is ready
    weatherInformation.style.display = "none" //hide the card that shows the weather info
    fetchData(`${url}weather?address=${location}`); 
    //clean the form
    document.querySelector("#location").value = ""
})

//this function is responsible for fetching the data from server
const fetchData = (url) => {
    //using fetch method to make a request
    fetch(url).then((response) => {
    //wait for the json response
    response.json().then((data) => {
        if(data.error){
            //if there's an error, hide the gif and render the error to the user
            loadingGif.style.display = "none"
            renderErrorCard(data.error);
        }else{
            //if everything goes well, the gif is hidden and all the weather info is shown
            loadingGif.style.display = "none"
            renderForecast(data);
        }
    })
    }).catch((error) => {
        console.log(error)
    })
}

const renderForecast = (data) => {
    //this function is responsible for rendering the data
    weatherInformation.style.display = "block"
    addressLink.textContent = data.place_name
    addressLink.href = `https://www.google.com/maps?q=${data.lat},${data.lng}`
    temperature.textContent = data.temperature
    apparentTemp.textContent = data.apparentTemperature
    summary.textContent = data.precipProbability
    
}

//This function is responsible for fetching the current user's location
function getUsersLoc() {
    navigator.geolocation.getCurrentPosition((pos) => {
        if(!navigator.geolocation){
            return alert("Geolocation not available on your browser!")
        }
        loadingGif.style.display = "inline"
        let coords = {lat: pos.coords.latitude, lng: pos.coords.longitude}
        //Pass the coordinates to fecthData to fetch the forecast
        fetchData(`${url}localweather?lat=${coords.lat}&lng=${coords.lng}`);
    })
} 

//This function renders the error when there's one
const renderErrorCard = (error) => {
    loadingGif.style.display = "none";
    errorCard.style.display = "block";
    errorCard.childNodes[1].textContent = error; //Get the p tag inside of the errorCard div and insert the error msg in it

    setTimeout(() => {
        //After 3 secs the error msg is hidden
        errorCard.style.display = "none";
    }, 3000);
}

