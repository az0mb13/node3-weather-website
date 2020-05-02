const express = require('express');
const path = require('path');
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const viewsPath = path.join(__dirname, '../templates/views')
const publicDirectoryPath = path.join(__dirname, '../public')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup Handlebars Engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Aditya'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Aditya'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: "Help message here",
        name: 'Aditya'

    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'address must be provided.'
        })
    }

        geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
            if (error) {
                return res.send({ error })
            }
            
            forecast(latitude, longitude, (error, forecastData) => {
                if(error) {
                    return res.send({error})
                }

                res.send({
                    forecast: forecastData,
                    location,
                    address: req.query.address
                })
            })
        })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
         return res.send({
             error: 'You must provide a search term.'
         })
    }  

    console.log(req.query.search)
    res.send({
        products: []
    })
})


app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help article not found!',
        title: '404', 
        name: 'Aditya'
    })
})

//404 handler
app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found!',
        title: '404', 
        name: 'Aditya'
    })

})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})

