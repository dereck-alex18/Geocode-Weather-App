const request = require('request');

const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoiYWxleHBvcnQiLCJhIjoiY2p0aXd3aTN1MHBncTN6cXpndHgweW15ZiJ9.-aOKCgIOEN268hVPxQ40cQ`
    request({url, json: true}, (error, response) => {
        if(error){
            //If there is an low-level error such as no internet connection, this piece of code runs
            callback("Unable to connect to server", undefined);
        }else if(response.body.features.length === 0){
            //If the API returns an error this block of code runs
            callback("The given location is invalid!", undefined);
        }else {
            //If everything goes well the code bellow is run
            const data = 
            {
                lat: response.body.features[0].geometry.coordinates[1],
                lng: response.body.features[0].geometry.coordinates[0],
                place_name: response.body.features[0].place_name
            }
            callback(undefined, data);
        }
    });
}

module.exports = {
    geocode
}