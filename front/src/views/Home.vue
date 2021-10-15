<template>
  <div>
      <h1>Centrale Life 👽</h1>
      <div class="action">
        <div id="rejoindre_salle" class="rejoindre_salle"><button>Je rejoins une salle !</button></div>
        <div id="creer_salle" class="creer_salle"><button  :disabled="hasCreatedRoom" v-on:click="createRoom">Je créé ma salle !</button></div>
      </div>
  </div>
</template>

<script>

 
  export default {
    name: 'Home',
    data: function() {
      return {
        hasCreatedRoom: false
      }
    },
    methods: {
      createRoom: function () {
        this.hasCreatedRoom = true;
        const io = require("socket.io-client");
        const socket = io("http://localhost:8081");
        socket.on("connect", () => {
            console.log(`Connecté au serveur: socket_id = ${socket.id}`);
        });
        socket.on('get_hash', function(msg){
            console.log(msg["room_token"]);
            window.location.replace("http://localhost:8080/room/" + msg["room_token"])
        });
      },

    }

  }
</script>

<style>
  .action {
    background-color: azure;
    margin: 0 20vw;
    border: 1px solid black;
    border-radius: 5px;
    display: grid;
    place-items: center;
  }

  .rejoindre_salle {
    grid-column: 1 / span 1;
    grid-row: 1 /span 1;
    padding: 20px 0;
  }

  .creer_salle {
    grid-column: 1 / span 1;
    grid-row: 2 /span 1;
    padding: 20px 0;
  }
</style>