<template>
  <div style="height: 100%;">
      <Board :users="users" />
  </div>
</template>

<script>
import Board from "../components/Board.vue"

export default {
  name: 'Room',
  components: {
    Board,
  },
  data() {
    return {
      socket: require("socket.io-client")("http://localhost:8081"),
      room_token: window.location.pathname.replace('/room/', ''), // TODO: A remplacer par la valeur de la room qu'on passe à la vue
      pseudo: "Alexandre",
      users: []
    }
  },
  methods: {
    connectToRoom: function() {
      this.socket.emit('enter_room', {room : this.room_token, pseudo : this.pseudo});
    },
    listenToEvents: function() {
      this.socket.on('list_players', (players) => {
        this.users = players;
        console.log(`Players' list update !`);
      })
      
      this.socket.on('rolled_dice', (data) => {
        console.log(`Just rolled the dices. New value: ${data.dices}`);
      });

      this.socket.on('made_choice', (data) => {
        console.log(`Just made a choice. New value: ${data.choice}`);
      });

      this.socket.on('updated_game_data', (data) => {
        console.log(`Just updated the game data. New value: ${data.game}`);
      })
    }
  },
  beforeMount() {
    this.connectToRoom();
    this.listenToEvents();
  }
}
</script>

<style>

</style>