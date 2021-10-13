// optional: allow environment to specify port
const port = process.env.PORT || 8081


const express = require('express')
const http = require('http');

const app = express()  // create server instance
const server = http.createServer(app)

app.use(function (req, res, next) {
    date = new Date(Date.now())
    console.log('Time:', date.toLocaleDateString(), date.toLocaleTimeString(), "; url :", req.url);
    next(); // sans cette ligne on ne pourra pas poursuivre.
})

// app.use(express.static('front/dist'))

app.get('/', (req, res) => {
    res.redirect(301, '/static/index.html')
})

app.get('/baguette', (req, res) => {
    res.json({username: 'Baguette'})
})




server.listen(port, () => console.log(`Listening on port ${port}`))



