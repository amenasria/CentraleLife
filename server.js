// optional: allow environment to specify port
const port = process.env.PORT || 8081


const express = require('express')
const http = require('http');

const app = express()  // create server instance
const server = http.createServer(app)

// app.use(express.static('front/dist'))

app.get('/baguette', (req, res) => {
    res.json({username: 'Baguette'})
})


server.listen(port, () => console.log(`Listening on port ${port}`))



