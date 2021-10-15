<template>
  <div>
      <h1>{{this.$route.params["room_token"]}}</h1>
      <Board />
  </div>
</template>

<script>
import Board from "../components/Board.vue"



export default {
  name: 'Room',
  components: {
    Board
  },
  methods: {
    connectToWS: function() {
      let room_token = window.location.hostname;
      console.log(room_token);
    }
  },
  beforeMount() {
    this.connectToWS()
  }
}
</script>

<style>

</style>