<template>
  <div style="height: 100%;">
      <Modal ref="RoomModal">
        <template v-slot:header>
          <h1>Qui êtes-vous?</h1>
        </template>
        <template v-slot:body>
          <span style="text-align: center; font-size: 15px; color: var(--color-input-ft)">Veuillez entrer votre pseudo pour la partie</span>
          <div style="margin: 3% 0 3% 0"><b>Pseudo</b> <b style="color: red;">*</b></div>
          <div>
            <input type="text" id="pseudo" name="pseudo" v-model="pseudo" placeholder="Pseudonyme" maxlength="8" v-on:keyup.enter="setup()">
          </div>
        </template>
        <template v-slot:footer>
          <div style="display: flex; align-items: flex-start; justify-content: space-between;">
            <button @click="$router.push('/');" class="back_btn">Retour à l'accueil</button>
            <button v-on:click="setup()" class="join_btn">Me connecter !</button>
          </div>
        </template>
      </Modal>
      <Board :users="users" :hasStarted="hasStarted" :myId="myId"/>
  </div>
</template>

<script>
import Board from "../components/Board.vue"
import Modal from "../components/Modal.vue"

export default {
  name: 'Room',
  components: {
    Board,
    Modal
  },
  data() {
    return {
      socket: require("socket.io-client")("http://node.sauge.ovh1.ec-m.fr:10413"),
      room_token: window.location.pathname.replace('/room/', ''), // TODO: A remplacer par la valeur de la room qu'on passe à la vue
      pseudo: "",
      users: [],
      hasStarted: false,
      myId: -1
    }
  },
  methods: {
    connectToRoom: function() {
      this.socket.emit('enter_room', {room : this.room_token, pseudo : this.pseudo});
      console.log({room : this.room_token, pseudo : this.pseudo});
      console.log("c done kwa");
    },
    listenToEvents: function() {
      this.socket.on('updated_game_data', (data) => {
        this.users = data.users;
      })
      
      this.socket.on('your_id', (player_id) => {
        console.log(`Your id is ${player_id}`);
        this.myId = player_id;
      })

      this.socket.on('made_choice', (data) => {
        console.log(`Just made a choice. New value: ${data.choice}`);
      });


      this.socket.on('start_game', () => {
        this.hasStarted = true;
      })
    },
    setup: function () {
      this.$refs.RoomModal.closeModal();
      this.connectToRoom();
      this.listenToEvents();
    }
  },
  mounted() {
    // Open the modal
    this.$refs.RoomModal.openModal();
    // When the modal appeared, focus on the pseudo field
    this.$nextTick(() => {
      document.getElementById("pseudo").focus();      
    })
  }
}
</script>

<style>

</style>