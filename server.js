// optional: allow environment to specify port
const port = process.env.PORT || 8081


const express = require('express');
const http = require('http');
const crypto = require('crypto');


const app = express()  // create server instance
const server = http.createServer(app)
const io = require('socket.io')(server)

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

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname })
})

// Etablissement de la connexion
io.on('connection', (socket) =>{
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  console.log(`Connecté au client: socket_id = ${socket.id}`);
  let salt = "Baguette";
  let room_token = crypto.createHash('sha256').update(String(Date.now()) + salt).digest('hex').slice(0, 5).toUpperCase();
  io.emit('get_hash', {room_token: room_token});
})





server.listen(port, () => console.log(`Listening on port ${port}`))



