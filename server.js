// optional: allow environment to specify port
const port = process.env.PORT || 8081


const express = require('express');
const http = require('http');
const crypto = require('crypto');


const app = express()  // create server instance
const server = http.createServer(app)
const io = require('socket.io')(server)
const mapRooms = new Map()



// Logging every request made to the server
app.use(function (req, res, next) {
    date = new Date(Date.now())
    console.log(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] ${req.method} ${req.url}`);
    next(); // sans cette ligne on ne pourra pas poursuivre.
})

// app.use(express.static('front/dist'))

app.get('/', (req, res) => {
    res.redirect(301, '/static/index.html')
})

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname })
})

// Allowing front to check if a room exists
app.head('/room/[A-Z0-9]{5}', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*"); // Until in prod we'll have to do this
  let room_token = req.url.replace("/room/", "");
  if (roomIsInDB(room_token)) {
    res.status(200);
    res.send("Room exists");
  } else {
    res.status(404);
    res.send("Room not found");
  }
})

// Creating a new room
app.put('/room', function(req, res) {
  let salt = "Baguette";
  let room_token = crypto.createHash('sha256').update(String(Date.now()) + salt).digest('hex').slice(0, 5).toUpperCase();
  mapRooms.set(room_token, {});
  res.status(201);
  res.send("Room created");
})

function roomIsInDB(room_token) {
  return mapRooms.has(room_token)
}

// Etablissement de la connexion
io.on('connection', (socket) =>{
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('enter_room', (data) => {
    console.log(`Received from enter_room: ${data.room}`);
  })
  console.log(`Connecté au client: socket_id = ${socket.id}`);
  let salt = "Baguette";
  let room_token = crypto.createHash('sha256').update(String(Date.now()) + salt).digest('hex').slice(0, 5).toUpperCase();
  io.emit('get_hash', {room_token: room_token});
})





server.listen(port, () => console.log(`Listening on port ${port}`))



