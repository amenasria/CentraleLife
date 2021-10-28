<template>
  <div>
      <h1>Centrale Life 👽</h1>
      <div class="action">
        <Modal ref="RoomModal">
          <template v-slot:header>
            <h1>Rejoindre une salle</h1>
          </template>
          <template v-slot:body>
            <span style="text-align: center; font-size: 15px; color: var(--color-input-ft)">Entre un lien d'invitation ci-dessous pour rejoindre un serveur existant</span>
            <div style="margin: 3% 0 3% 0"><b>Lien d'invitation</b> <b style="color: red;">*</b></div>
            <div>
              <input type="text" id="lien_invitation" name="lien_invitation" v-model="lien_invitation" :placeholder="window.location.href + 'room/F5444'">
            </div>
            <div style="margin: 3% 0 2% 0"><b>Les invitations devraient ressembler à</b></div>
            <div style="color: var(--color-examples)">F5444<br/>{{window.location.href}}room/F5444
            </div>
          </template>
          <template v-slot:footer>
            <div style="display: flex; align-items: flex-start; justify-content: space-between;">
              <button @click="$refs.RoomModal.closeModal()" class="back_btn">Retour</button>
              <button v-on:click="joinRoom()" class="join_btn">Rejoindre la salle</button>
            </div>
          </template>
        </Modal>
        <div id="rejoindre_salle" class="rejoindre_salle" v-on:click="$refs.RoomModal.openModal()"><button>Je rejoins une salle !</button></div>
        <div id="creer_salle" class="creer_salle"><button  :disabled="hasCreatedRoom" v-on:click="createRoom">Je créé ma salle !</button></div> <!-- TODO: Ajouter msg si serveur répond pas direct kwa -->
      </div>
  </div>
</template>

<script>
import Modal from "../components/Modal.vue"
import axios from 'axios';
 
export default {
  name: 'Home',
  components: {
    Modal,
  },
  data: function() {
    return {
      hasCreatedRoom: false,
      lien_invitation: ""
    }
  },
  methods: {
    createRoom: function () {
      this.hasCreatedRoom = true;
      axios
        .put(`${window.location.href}api/room`)
        .then(response => {
          if (response.status === 201) { // If room is created then enter it
            window.location.replace(`${window.location.href}room/${response.data}`)
          } else {
            console.warn(`Couldn't create room, response :\n${response}`);
          }
        });
    },

    joinRoom: function () {
      // let room_regexp = new RegExp("/^https?://(www.)?localhost:8081/api/room/[a-zA-Z0-9]{5}$/");
      let room_regexp = new RegExp("/^https?://(www.)?" + `${window.location.href}` + "room/[a-zA-Z0-9]{5}$/");

      // If the link matches the model then check if the room exists in the DB
      if (this.lien_invitation.match(room_regexp) != null) {
        this.location.replace(this.lien_invitation)
        // console.log(this.lien_invitation)
        // axios
        //   .head(this.lien_invitation)
        //   .then(response => console.log((this.info = response)))
      }
    }

  }

}
</script>

<style>
    :root {
        --bleu-centrale: #000f9f;
        --color-input-bg: #e2eaf5;
        --color-input-ft-placeholder:#9ca9bd;
        --color-input-ft:#757f8d;
        --color-case: #eff0f4;
        --color-examples: #535a64;
    }

    #lien_invitation {
      background-color: var(--color-input-bg);
      color: var(--color-input-ft);
      border: none;
      line-height: 4ch;
      width: 98%;
      font-size: 18px;
      padding-left: 2%;
    }

    #lien_invitation:focus {
      outline: none
    }

    #lien_invitation::placeholder {
      color: var(--color-input-ft-placeholder);
    }

  .join_btn {
    background-color: var(--bleu-centrale);
    border: 0;
    color: white;
    border-radius: 4px;
    padding: 1em 1em;
    font-weight: bold;
    cursor: pointer;
  }

  .back_btn {
    background-color: transparent;
    border: 0;
    font-weight: bold;
    cursor: pointer;
    padding: 1em 1em;
    color: var(--color-input-ft);
  }
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