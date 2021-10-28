<template>
  <div style="height: 100%;">
      <Board />
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
      socket: require("socket.io-client")("http://node.marjolaine.ovh1.ec-m.fr"),
      room_token: window.location.pathname.replace('/room/', ''), // TODO: A remplacer par la valeur de la room qu'on passe à la vue
      pseudo: "Alexandre"
    }
  },
  methods: {
    connectToRoom: function() {
      this.socket.emit('enter_room', {room : this.room_token, pseudo : this.pseudo});
    },
    listenToEvents: function() {
      this.socket.on('new_player_joined', (data) => {
        console.log(`A new player just joined. Its name: ${data.pseudo}`);
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
    this.connectToRoom()
  }
}
</script>

<style>

</style>