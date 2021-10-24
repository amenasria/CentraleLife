// optional: allow environment to specify port
const port = process.env.PORT || 8081


const express = require('express');
const cors = require('cors');
const http = require('http');
const crypto = require('crypto');


const app = express();  // create server instance
const server = http.createServer(app);
const io = require('socket.io')(server);
const mapRooms = new Map();
const userSocketToRoom = new Map();
const nb_max_players = 4;
const empty_user = {"id": 0, "name": "", "color": "", "money": 0, "position": 1, "in_prison": -1, "properties": []};
const empty_room = {"users": []};
const colorsList = ["green", "red", "orange", "purple"];

class Player {
  constructor(id, name, color, money, position, in_prison, properties) {
    this.id = id;
    this.name = name
    this.color = color;
    this.money = money;
    this.position = position;
    this.in_prison = in_prison;
    this.properties = properties;
  }
}

app.use(cors()); // Until prod we'll have to do this

// Logging every request made to the server
app.use(function (req, res, next) {
    date = new Date(Date.now());
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

// Creating a new room
app.put('/api/room', function(req, res, next) {
  let salt = "Baguette";
  let room_token = crypto.createHash('sha256').update(String(Date.now()) + salt).digest('hex').slice(0, 5).toUpperCase();
  mapRooms.set(room_token, {"users": []});
  res.status(201);
  res.send(room_token);
  next();
})

app.use(function (req, res, next) {
  console.log(mapRooms);
  next();
})


// Allowing front to check if a room exists
app.head('/api/room/[A-Z0-9]{5}', function(req, res) {
  let room_token = req.url.replace("/room/", "");
  if (roomIsInDB(room_token)) {
    res.status(200);
    res.send("Room exists");
  } else {
    res.status(404);
    res.send("Room not found");
  }
})



function roomIsInDB(room_token) {
  return mapRooms.has(room_token)
}

// Etablissement de la connexion
io.on('connection', (socket) =>{

  
  // If the room exists & is not full then the user will be added to the room
  socket.on('enter_room', (data) => {
    let room_token = data.room;
    let is_room_accessible = mapRooms.has(room_token) && mapRooms.get(room_token)["users"].length < nb_max_players;
    if (is_room_accessible) {
      socket.join(room_token);
      player_id = mapRooms.get(room_token)["users"].length + 1
      let new_user = new Player(player_id, data.name, colorsList[player_id - 1], 1, -1, []);
      mapRooms.get(room_token)["users"].push(new_user);
      console.log(`User ${socket.id} entered room ${room_token}`);
    }
    userSocketToRoom.set(socket.id, is_room_accessible ? [room_token, player_id] : ["", 0]);
    console.log(mapRooms);
  })



  socket.on('disconnect', () => {
    let socketUserAndRoom = userSocketToRoom.get(socket.id);
    if (socketUserAndRoom[0] != "") {
      mapRooms.get(socketUserAndRoom[0]).delete(socketUserAndRoom[1])
      // TODO: ADD EVENT updated_game_data TO REMOVE PLAYER FROM ROOM
    }
    console.log('user disconnected');
  });


  broadcast_events = ['new_player_joined', 'rolled_dice', 'made_choice', 'updated_game_data']
  broadcast_events.forEach(event => {
    socket.on(event, (data) => {
      console.log(`Received from msg from ${event}`);
      socket.broadcast.emit(event, data);
    })
  });
})





server.listen(port, () => console.log(`Listening on port ${port}`))



