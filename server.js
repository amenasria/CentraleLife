// optional: allow environment to specify port
const port = process.env.PORT || 8081


const express = require('express');
const cors = require('cors');
const http = require('http');
const crypto = require('crypto');

playerFile = require("./player.js");


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
    socket.join(room_token);
    console.log(socket.rooms);
    let is_room_accessible = mapRooms.has(room_token) && mapRooms.get(room_token)["users"].length < nb_max_players;
    if (is_room_accessible) {
      player_id = mapRooms.get(room_token)["users"].length;
      player_name = data.hasOwnProperty("pseudo") ? data.pseudo : `User ${player_id}`;
      let new_player = new Player(player_id, player_name, colorsList[player_id], 250, 1, -1, []);
      mapRooms.get(room_token)["users"].push(new_player);
      console.log(`User ${socket.id} entered room ${room_token}`);
      io.sockets.in(room_token).emit('list_players', mapRooms.get(room_token)["users"]);
    }
    userSocketToRoom.set(socket.id, is_room_accessible ? [room_token, player_id] : ["", -1]);
    // console.log(socket.rooms);
  })

  socket.on('roll_dice', (player_id) => {
    let room_token = userSocketToRoom.get(socket.id)[0];
    current_player = mapRooms.get(room_token)["users"][player_id]; // Bug si la salle n'existe pas déjà A FIX
    var [lancer1, lancer2, modified_player] = playerFile.rollDice(current_player);
    mapRooms.get(room_token)["users"][player_id] = modified_player;
    io.sockets.in(room_token).emit('rolled_dice', {"lancer1": lancer1, "lancer2": lancer2});
    io.sockets.in(room_token).emit('updated_game_data', mapRooms.get(room_token));
  })

  socket.on('finish_action', (data) => {
    [choice, current_player] = data.choice, mapRooms.get(room_token)["users"][data.player_id];
  })



  socket.on('disconnect', () => {
    if (userSocketToRoom.has(socket.id)) {
      let socketRoomAndUser = userSocketToRoom.get(socket.id);
      if (socketRoomAndUser[0] != "") {
        console.log(mapRooms.get(socketRoomAndUser[0]));
        mapRooms.get(socketRoomAndUser[0]).users.splice(socketRoomAndUser[1]);
        // TODO: ADD EVENT updated_game_data TO REMOVE PLAYER FROM ROOM
      }
    }
    console.log('user disconnected');
  });


  broadcast_events = ['list_players', 'rolled_dice', 'made_choice', 'updated_game_data']
  broadcast_events.forEach(event => {
    socket.on(event, (data) => {
      console.log(`Received from msg from ${event}`);
      socket.broadcast.emit(event, data);
    })
  });
})





server.listen(port, () => console.log(`Listening on port ${port}`))



