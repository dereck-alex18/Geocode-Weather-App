const request = require('request');
const dotenv = require('dotenv');

dotenv.config();

const forecast = (coordinates, callback) => {
    const url = `https://api.darksky.net/forecast/${process.env.FORECAST_KEY}/${coordinates.lat},${coordinates.lng}?units=si`
    request({url, json: true}, (error, response) => {
        if(error){
            //If there is an low-level error such as no internet connection, this piece of code runs
            callback("Unable to connect to server!", undefined);
        }else if(response.body.error){
            //If the API returns an error this block of code runs
            callback("Unable to get the weather!", undefined);
        }else {
            //If everything goes well the code bellow is run
            const data = response.body.currently;
            callback(undefined, data);
        }
    });

}

module.exports = {
    forecast
}