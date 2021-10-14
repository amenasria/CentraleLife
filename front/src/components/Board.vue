<template>
  <div class="interface_monopoly">
    <div class="board">
        <liste-cases :cases="coin_haut_gauche" type_liste="monopoly_coin"></liste-cases>
        <liste-cases :cases="cases_haut" type_liste="monopoly_row"></liste-cases>
        <liste-cases :cases="coin_haut_droite" type_liste="monopoly_coin"></liste-cases>
        <liste-cases :cases="cases_gauche" type_liste="monopoly_col"></liste-cases>
        <div class="case_centrale">
            <div class="central_ui">
                <div class="central_ui_dices">Dices</div>
                <div class="central_ui_header"><h2>C'est à {{users[player].name}} de jouer.</h2></div>
                <div class="central_ui_buttons">
                    <button class="button_ui" id="button_dice" :disabled='blockdice' v-on:click="dice(player)">Lancer les dés</button>
                    <button class="button_ui">Voir mes cartes</button>
                </div>
                <div class="central_ui_display" id="show_game">
                    <h3 id="name_case"></h3>
                    <p id="message"></p>
                    <div class="central_ui_buttons">
                      <button class="button_ui" id="button_cancel">Refuser</button>
                      <button class="button_ui" id="button_ok" v-on:click="ok(player)">Allez-y !</button>
                    </div>
                </div>
            </div>
        </div>
        <liste-cases :cases="cases_droite" type_liste="monopoly_col"></liste-cases>
        <liste-cases :cases="coin_bas_gauche" type_liste="monopoly_coin"></liste-cases>
        <liste-cases :cases="cases_bas" type_liste="monopoly_row"></liste-cases>
        <div class="case_depart">🡸</div>
    </div>
    <div class="menu">
        <h1>CENTRALE <br>LIFE</h1>
        <h2>4 joueurs</h2>
        <div class="liste_joueurs">
            <div class="joueur" v-for="user in users" :key="user.id" :style="'--user-color: ' + user.color">
                <span class="user_icon"><svg aria-hidden="true" focusable="false" role="img" alt="User" style="height: 3.5ch" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path :fill="[user.id === 2 ? 'white' : user.color]" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg></span>
                <span class="user_info">
                    <span class="user_name"><b>{{ user.name }}</b></span>
                    <span class="user_money">{{ user.money }}€</span>
                </span>
            </div>
        </div>
        <div class="player_buttons">
            <button class="button_ui">Mettre en pause</button>
            <button class="button_ui">Abandonner la partie</button>
        </div>
    </div>
  </div>
</template>

<script>
import casesData from "@/assets/cases.json";
import usersData from "@/assets/users.json";
import ListeCases from "@/components/ListeCases.vue";
import axios from 'axios';
import {rollDice, click_ok} from "../js/utils.js"

export default {
    components: {
        ListeCases
    },
    data() {
        return {
            coin_bas_droite: casesData.slice(1, 2), 
            cases_bas: casesData.slice(2, 11).reverse(),
            coin_bas_gauche: casesData.slice(11, 12), 
            cases_gauche: casesData.slice(12, 21).reverse(),
            coin_haut_gauche: casesData.slice(21, 22),
            cases_haut: casesData.slice(22, 31),
            coin_haut_droite: casesData.slice(31, 32),
            cases_droite: casesData.slice(32, 41),
            users: usersData,
            player: 0,
            blockdice: false,
        }
    },
    methods: {
      dice(player){
        rollDice(player);
        this.blockdice = true;
        let button_dice = document.getElementById('button_dice');
        button_dice.style.background = '#CDCDCF';
      },
      ok: function(player) {
        click_ok(player);
        this.player = (player + 1) % 4;
        this.blockdice = false;
        let button_dice = document.getElementById('button_dice');
        button_dice.style.background = '#000F9F';
      },

    },
    mounted() {
        axios
            .get('http://localhost:8081/baguette')
            .then(response => (this.info = response))
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

    }

    .button_ui {
        background-color: var(--bleu-centrale);
        color: white;
        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
        border-radius: 50px;
        border-style: none;
        height: 6vh;
        margin: 2%;
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


    .interface_monopoly {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        padding: 1% 10%;
        place-items: center;
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
        width: 50%;
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
</style>