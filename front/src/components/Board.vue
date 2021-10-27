<template>
  <div class="interface_monopoly" :class="{night: !day}">

    <Modal ref="PropertiesModal">
      <template v-slot:header>
        <h1>Les propriétés de {{users[player].name}}</h1>
      </template>
      <template v-slot:body>
        <div v-for="property in users[player].properties" :key="property">
          <span style="text-align: left; margin-right: 50px"><b>{{ cases[property].name }}</b></span>
          <span style="text-align: center; margin-right: 50px">Prix : {{ cases[property].price }} €</span>
          <span style="text-align: right;">Loyer : {{ cases[property].rent }} €</span>
        </div>
      </template>
      <template v-slot:footer>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <button @click="$refs.PropertiesModal.closeModal()" class="join_btn">Fermer</button>
        </div>
      </template>
    </Modal>


    <div class="board">
        <liste-cases :cases="coin_haut_gauche" type_liste="monopoly_coin"></liste-cases>
        <liste-cases :cases="cases_haut" type_liste="monopoly_row"></liste-cases>
        <liste-cases :cases="coin_haut_droite" type_liste="monopoly_coin"></liste-cases>
        <liste-cases :cases="cases_gauche" type_liste="monopoly_col"></liste-cases>
        <div class="case_centrale">
            <div class="central_start" v-if='!hasStarted'>
              <img :src="require('../assets/logo_board.png')" alt="Logo Centrale Life" style="width: 70%">
              <button class="button_ui" id="button_start" v-on:click="start_game()">Commencer la partie !</button>
            </div>
            <div class="central_ui" v-if='hasStarted'>
                <div class="central_ui_dices">
                  <span id="dice1"></span>
                  <span id="dice2"></span>
                </div>
                <div class="central_ui_header"><!--<h2 :class="{night: !day, neon_text_small: !day}" :style="'--neon-color: ' + users[player].color" id="player">C'est à {{users[player].name}} de jouer.</h2>--></div>
                <div class="central_ui_buttons">
                    <button class="button_ui" id="button_dice" :disabled='blockdice' v-on:click="dice(player)">Lancer les dés</button>
                    <button class="button_ui" id="button_card" v-on:click="$refs.PropertiesModal.openModal()" :disabled="hasStarted">Voir mes cartes</button>
                </div>
                <div class="central_ui_display" id="show_game">
                    <h3 id="name_case"></h3>
                    <p id="message"></p>
                    <div class="central_ui_buttons">
                      <button class="button_ui" id="button_cancel" v-on:click="cancel()">Refuser</button>
                      <button class="button_ui" id="button_ok" v-on:click="ok(player, card, lancer, cagnotte)"></button>
                    </div>
                </div>
            </div>
        </div>
        <liste-cases :cases="cases_droite" type_liste="monopoly_col"></liste-cases>
        <liste-cases :cases="coin_bas_gauche" type_liste="monopoly_coin"></liste-cases>
        <liste-cases :cases="cases_bas" type_liste="monopoly_row"></liste-cases>
        <div id="case_1" class="case_depart" style="position: relative">
          <div class="pawn_container"></div>
            🡸
        </div>
    </div>
    <div class="menu">
        <dark-mode></dark-mode>
        <button v-on:click="toggleDarkMode"></button>
        <h1 style="margin-top: 0;" :class="{night: !day, neon_text_big: !day}">CENTRALE <br>LIFE</h1>
        <div :class="{night_text: !day}">Room <b>{{room_token}}</b></div>
        <div :class="{night_text: !day}">Montant de la cagnotte : {{cagnotte}}</div>
        <h2>{{ users.length }} joueurs</h2>
        <!-- {{ users }} -->
        <div class="liste_joueurs">
            <div class="joueur" v-for="user in users" :key="user.id" :class="{active: $data.player + 1 === user.id }" :style="'--user-color: ' + user.color">
                <span class="user_icon"><svg aria-hidden="true" focusable="false" role="img" alt="User" style="height: 3.5ch" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path :fill="[user.id === player + 1 ? 'white' : user.in_prison === -1 ? user.color : 'black']" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg></span>
                <span class="user_info">
                  <span class="user_name"><b>{{ user.name }}</b></span>
                  <span class="user_money" v-if="winner === user.id - 1">Gagné !</span>
                  <span class="user_money" v-else-if="!user.lost">{{user.money}} €</span>
                  <span class="user_money" v-else>Perdu</span>
                </span>
            </div>
        </div>
        <!-- <div class="player_buttons">
            <button class="button_ui">Mettre en pause</button>
            <button class="button_ui">Abandonner la partie</button>
        </div> -->
    </div>
  </div>


</template>

<script>
import casesData from "@/assets/cases.json";
import ListeCases from "@/components/ListeCases.vue";
import DarkMode from "@/components/DarkMode.vue"
// import axios from 'axios';
import {click_ok} from "../js/utils.js"
import Modal from "./Modal";

export default {
    name: "Board",
    components: {
        ListeCases,
        DarkMode,
        Modal,
    },
    props: ['users', 'hasStarted'],
    data() {
        return {
            cases: casesData,
            coin_bas_droite: casesData.slice(1, 2), 
            cases_bas: casesData.slice(2, 11).reverse(),
            coin_bas_gauche: casesData.slice(11, 12), 
            cases_gauche: casesData.slice(12, 21).reverse(),
            coin_haut_gauche: casesData.slice(21, 22),
            cases_haut: casesData.slice(22, 31),
            coin_haut_droite: casesData.slice(31, 32),
            cases_droite: casesData.slice(32, 41),
            player: 0,
            blockdice: false,
            card: null,
            lancer: 0,
            cagnotte : 0,
            day: true, // 0 if day 1 if night
            room_token: document.location.pathname.replace("/room/", ""),
            winner: -1
        }
    },
    methods: {
      start_game() {
        console.log("Start the game !");
      },
      toggleDarkMode() {
        let darkmode_checkbox = document.getElementById("toggleDarkMode");
        darkmode_checkbox.checked = !darkmode_checkbox.checked;
        this.day = ! this.day;
      },
      initPawns(){
        this.users.forEach(user => {
            console.log(user);
            let case_depart = document.getElementById("case_1");
            let pawn_container = case_depart.getElementsByClassName("pawn_container")[0];
            let pawn = document.createElement("div");
            pawn.setAttribute("style", `--user-color: ${user.color}`);
            pawn.setAttribute("class", "pawn");
            pawn.setAttribute("id", `pawn_player_${user.id}`)
            pawn_container.appendChild(pawn);
        });
      },
      movePawns(new_pos, player){
          let pawn = document.getElementById(`pawn_player_${player + 1}`);
          let pawn_container = document.getElementById(`case_${new_pos}`).getElementsByClassName("pawn_container")[0];
          pawn_container.appendChild(pawn);
      },
      dice(player){
        this.$parent.socket.emit('roll_dice', player);
      },
      ok: function(player, card, lancer, cagnotte) {
        let resp = click_ok(player, card, lancer, cagnotte);
        let new_pos = this.users[player].position
        this.movePawns(new_pos, player);
        this.cagnotte = resp.cagnotte;
        this.blockdice = resp.block;
        if(!resp.block){
          let button_dice = document.getElementById('button_dice');
          button_dice.style.background = '#000F9F';
          let dice1 = document.getElementById("dice1");
          let dice2 = document.getElementById("dice2");
          dice1.innerHTML = "";
          dice2.innerHTML = "";
          let loser = 0;
          let winner = -1;
          for(let i = 0; i < this.users.length; i++){
            if(this.users[i].lost){
              loser += 1;
            } else {
              winner = i;
            }
          }
          if(loser === this.users.length - 1){
            this.winner = winner;
            this.player = this.winner;
            this.win();
          } else{
            this.player = (this.player + 1) % 4;
            while(this.users[this.player].lost){
              this.player = (this.player + 1) % 4;
            }
          }

        }
        this.card = null;
      },
      cancel: function() {
        let loser = 0;
        let winner = -1;
        for(let i = 0; i < this.users.length; i++){
          if(this.users[i].lost){
            loser += 1;
          } else {
            winner = i;
          }
        }
        if(loser === this.users.length - 1){
          this.winner = winner;
          this.player = this.winner;
          this.win();
        } else{
          this.player = (this.player + 1) % 4;
          while(this.users[this.player].lost){
            this.player = (this.player + 1) % 4;
          }
        }
        this.blockdice = false;
        let button_dice = document.getElementById('button_dice');
        button_dice.style.background = '#000F9F';
        let game = document.getElementById('show_game');
        game.style.display = "none";
      },
      win(){
        let message = document.getElementById('message');
        let ok = document.getElementById('button_ok');
        let cancel = document.getElementById('button_cancel');
        let dice1 = document.getElementById("dice1");
        let dice2 = document.getElementById("dice2");
        let roll = document.getElementById("button_dice");
        let cards = document.getElementById("button_card");
        let player = document.getElementById("player");
        let game = document.getElementById("show_game");
        let title = document.getElementById("name_case");
        message.innerHTML = this.users[this.winner].name + " a gagné la partie !";
        ok.style.display = "none";
        cancel.style.display = 'none';
        dice1.style.display = 'none';
        dice2.style.display = 'none';
        roll.style.display = 'none';
        cards.style.display = 'none';
        player.style.display = 'none';
        game.style.display = 'block';
        title.innerHTML = ' Bravo ! 🎉';
      }
    },
    mounted() {
      console.log(this.users);
      this.initPawns();
    },
    beforeUpdate(){
      console.log(this.users);
    }
}
</script>

<style>
    :root {
        --vertical-gap: 5px;
        --horizontal-gap: 5px;
        --case-length: 3.8vw;
        --case-border-radius: 8px;

        --color-category-1: pink;
        --color-category-2: cyan;
        --color-category-3: purple;
        --color-category-4: orange;
        --color-category-5: red;
        --color-category-6: yellow;
        --color-category-7: green;
        --color-category-8: blue;

        --bleu-centrale: #000f9f;
        --color-case: #eff0f4;

        --neon-light: #fff;
        --neon-color: #0fa;

        --night-color: hsl(240, 100%, 10%);
    }

    .central_start {
      display: grid;
      place-items: center;

    }

    .neon_text_big {
        color: var(--neon-light);
        text-shadow:
            0 0 7px var(--neon-light),
            0 0 21px var(--neon-color),
            0 0 42px var(--neon-color),
            0 0 82px var(--neon-color),
            0 0 92px var(--neon-color);
    }

    .neon_text_small {
        color: var(--neon-light);
        text-shadow:
            0 0 7px var(--neon-light),
            0 0 10px var(--neon-color),
            0 0 21px var(--neon-color),
            0 0 42px var(--neon-color),
            0 0 82px var(--neon-color),
            0 0 92px var(--neon-color),
            0 0 102px var(--neon-color),
            0 0 151px var(--neon-color),
            0 0 203px var(--neon-color);
    }

    .pawn_container {
        z-index: 300;
        position: absolute;
        right: 0;
        width: 15px;
        height: max-content;
        align-self: center
    }

    .pawn {
        background: var(--user-color);
        height: 10px;
        width: 10px;
        margin-bottom: 2px;
        border-radius: 5px
    }

    .calanque > .pawn_container > .pawn {
        border: 1px solid white;
        border-radius: 5px;
    }

    .button_ui {
        background-color: var(--bleu-centrale);
        color: white;
        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
        border-radius: 50px;
        border-style: none;
        height: 6vh;
        margin: 2%;
        cursor: pointer;
    }

    .case_centrale {
        display: grid;
        align-items: center;
        place-content: center;
    }

    .central_ui {
        display: grid;
        grid-template-rows: repeat(4, 1fr);
        grid-template-columns: repeat(4, 1fr);
        height: 40vh;
    }

    .central_ui_dices {
        grid-row: 1 / span 1;
        grid-column: 1 / span 6
    }

    .central_ui_header {
        grid-row: 2 / span 1;
        grid-column: 1 / span 6
    }

    .central_ui_buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-row: 3 / span 1;
        grid-column: 1 / span 6;
        padding: 2% 0;
    }

    .centrale_ui_buttons .button_ui {
        grid-column: span 3;
    }

    .central_ui_display {
        background-color: var(--color-case);
        grid-row: 4 / span 1;
        grid-column: 1 / span 6;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 20px;
        padding: 1% 12%;
    }

    .player_buttons {
        display: grid;
        grid-template-rows: 1fr 1fr;
        padding: 5% 20%;
    }

    .user_money {
        color: var(--user-color);
    }

    .menu h1, .menu h2 {
        color: var(--bleu-centrale);
    }

    .menu h1.night {
        --neon-color:var(--bleu-centrale);
        color: var(--neon-light);
    }

    .central_ui_header h2.night {
        --neon-color:red;
        color: var(--neon-light);
    }

    .menu h1 {
        font-size: 3.5vmax;
    }

    .menu h2 {
        font-size: 1vmax;
    }

    .liste_joueurs {
        display: grid;
        grid-template-rows: repeat(4, 1fr);
        grid-template-columns: repeat(5, 1fr);
        row-gap: 15px;
        padding: 5% 10%;
    }
    
    .joueur {
        box-shadow: 0 0 0 0.5px var(--user-color);
        background-color: var(--color-case);
        border-radius: 3px;
        display: grid;
        grid-template-columns: 1fr 2fr;
        align-items: center;
        padding: 4% 0;
        grid-column: 2 / span 3
    }

    .user_name {
        font-size: 1vmax;
    }

    .user_icon {
        padding: 1%;
    }


    .joueur.active {
        color: white;
        background-color: var(--user-color);
    }

    .active .user_money {
        color: white;
    }

    .joueur .user_info {
        display: grid;
        grid-template-rows: 1fr 1fr;
        align-items: center;
    }

    .joueur .user_icon {
        text-align: center;
    }

    .bandeau_couleur {
        border-top-left-radius: var(--case-border-radius);
        border-top-right-radius: var(--case-border-radius);
        padding-top: 10%;
    }

    .categorie_1 .bandeau_couleur {background-color: var(--color-category-1);}
    .categorie_2 .bandeau_couleur {background-color: var(--color-category-2);}
    .categorie_3 .bandeau_couleur {background-color: var(--color-category-3);}
    .categorie_4 .bandeau_couleur {background-color: var(--color-category-4);}
    .categorie_5 .bandeau_couleur {background-color: var(--color-category-5);}
    .categorie_6 .bandeau_couleur {background-color: var(--color-category-6);}
    .categorie_7 .bandeau_couleur {background-color: var(--color-category-7);}
    .categorie_8 .bandeau_couleur {background-color: var(--color-category-8);}

    html {
        height: 100%;
    }

    body {
        margin: 0;
        height: 100%;
    }

    div#app {
        height: 100%;
    }

    .interface_monopoly {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        padding: 1% 10%;
        place-items: center;
        text-align: center;
        margin: 0;
        height: 100%;
    }
    
    .board {
        grid-column: 1 / span 3;
        display: grid;
        grid-template-rows: var(--case-length) auto var(--case-length);
        grid-template-columns: var(--case-length) auto var(--case-length);
        column-gap: var(--vertical-gap);
        row-gap: var(--horizontal-gap);
        width: 45vw;
        height: 45vw;
    }

    .interface_monopoly.night {
        background-color: var(--night-color);
    }

    .menu {
        grid-column: 4 / span 2;
        padding: 1% 5%;
    }


    .case {
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
        border-radius: var(--case-border-radius);
        font-size: 0.5vmax;
        display: grid;
        grid-template-rows: 3fr 7fr 2fr;
        background-color: var(--color-case);
        overflow: hidden;
    }

    .case_depart {
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
        border-radius: var(--case-border-radius);
        background-color: var(--bleu-centrale);
        display: grid;
        place-items: center;
        color: var(--color-case);
        font-size: 25px;
        font-weight: bold;
    }

    .case .case-text {
        display: grid;
        justify-items: center;
        padding: 10% 3%;
        overflow: hidden;
    }

    .case .case-img img {
        width: 45%;
        object-fit: cover;
        overflow: hidden;
    }

    .case.calanque {
        background-image: url("../assets/calanques.png");
        background-size: contain;
        color: white
    }

    .monopoly_row {
        display: grid;
        grid-template-columns: repeat(9, var(--case-length));
        column-gap: var(--vertical-gap);
    }

    .monopoly_col {
        display: grid;
        grid-template-rows: repeat(9, var(--case-length));
        row-gap: var(--horizontal-gap);
    }

    .monopoly_coin {
        display: grid;
    }

    #show_game {
      display: none;
    }

    #button_cancel {
      background: #4D5F80;
    }
</style>