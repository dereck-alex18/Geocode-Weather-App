const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const hbs = require('hbs');
const {forecast} = require('./utils/forecast');
const {geocode} = require('./utils/geocode');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config(); //setup environment variables

//Setup the paths for both static and views
const publicDirPath = path.join(__dirname, "../public");
const templatesPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
//Setup static directory
app.use(express.static(publicDirPath));

//Setup hbs engine and views location
app.set('view engine', 'hbs');
app.set('views', templatesPath);
hbs.registerPartials(partialsPath);

//root route
app.get('/', (req, res) => {
    res.render('index', {
        title: "Weather",
        name: "Dereck Portela"     
    });
});

//weather route. 
app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: "An address must be provided!"
        });
    }
    
    //Pass the location and a callback as arguments
    geocode(`${encodeURIComponent(req.query.address)}`, (error, {lat, lng, place_name} = {}) => {
       if(error){
            //If something went wrong the occured error is shown
            res.send({error});
        }else{
            //Otherwise forecast is called, the pair of coordinates from geocode and a cb are passed as arguments
            //It has to be called inside of the cb because the code is asynchronous
            forecast({lat, lng, place_name}, (error, {temperature, summary, precipProbability, apparentTemperature} = {}) => {
                if(error){
                    //If something went wrong the occured error is shown
                    res.send(error);
                }else{
                    //If everything goes well, a json with the forecast info is sent
                    res.send({
                        temperature: `${temperature}°C`,
                        apparentTemperature: `Feels like ${apparentTemperature}°C`,
                        precipProbability: `${summary}. There's ${precipProbability * 100}% chance of rain`,
                        place_name,
                        lat,
                        lng
                    })
                   
                }
            });
        }
    });

});

//localweather route. It was created to get the weather in the user's current location
app.get('/localweather', (req, res) => {
    if(!req.query.lat || !req.query.lng){
       return res.send({error: "Invalid Latitude or Longitude!"});
    }
    
    //pass the coordinates instead of the location's address
    geocode(`${req.query.lng},${req.query.lat}`, (error, {lat, lng, place_name} = {}) => {
       
        if(error){
            //If something went wrong the occured error is shown
            res.send({error});
        }else{
           
            //Otherwise forecast is called, the pair of coordinates from geocode and a cb are passed as arguments
            //It has to be called inside of the cb because the code is asynchronous
            forecast({lat, lng, place_name}, (error, {temperature, summary, precipProbability, apparentTemperature} = {}) => {
                if(error){
                    //If something went wrong the occured error is shown
                    res.send(error);
                }else{
                    //If everything goes well, a json with the forecast info is sent
                    res.send({
                        temperature: `${temperature}°C`,
                        apparentTemperature: `Feels like ${apparentTemperature}°C`,
                        precipProbability: `${summary}. There's ${precipProbability * 100}% chance of rain`,
                        place_name,
                        lat,
                        lng
                    })
                   
                }
            });
        }
    });
});

//help route
app.get('/help', (req, res) => {
    res.render('help', {
        title: "Help page",
        name: "Dereck Portela"
    });
});

//email route
app.get('/help/email', (req, res) => {
    if(!req.query.name || !req.query.email || !req.query.text){
       return res.send({error: "All fields must be filled!"});
    }
    const output = 
    `
        <ul>
            <li>From: ${req.query.name}</li>
            <li>Email: ${req.query.email}</li>
        </ul>
        <h3> Message </h3>
        <p>${req.query.text}</p>
    `;
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        requireTLS: true,
        // tls: {
        //    ciphers:'SSLv3',
           
        // },
        auth: {
            user: 'portec.weatherapp@gmail.com',
            pass: process.env.PASS
        }
    });
    
    // setup e-mail data, even with unicode symbols
    let mailOptions = {
        from: 'portec_weatherapp@outlook.com', // sender address (who sends)
        to: 'dereck_alexander@outlook.com', // list of receivers (who receives)
        subject: 'From weather app ', // Subject line
       // text: 'Hello world ', // plaintext body
        html: output // html body
    };
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            return res.send({error: "Something went wrong :("});
        }
    
        res.send({res: "Your message has been sent!"});
    });
    // res.redirect('/');
});

//about route
app.get('/about', (req, res) => {
    res.render('about', {
        title: "About page",
        name: "Dereck Portela"
    });
});

//If none of the above routes is matched, a 404 page is rendered
app.get('*', (req, res) => {
    res.render('404', {
        title: "404 page not found!",
        name: "Dereck Portela"
    })
});

app.listen(port, () => {
    console.log(`Server starting at port ${port}`);
});