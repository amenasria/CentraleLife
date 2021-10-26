import users from '../assets/users.json'
import cases from '../assets/cases.json'
import chance from '../assets/chance.json'

function changePosition(player, lancer){

    let new_position =  (users[player].position + lancer);
    if(new_position > 40){
        new_position -= 40;
        users[player].money += 200;
    }

    return new_position;
}

function hasEnoughMoney(player, price){

    let money = users[player].money;
    return price <= money;

}

function hasOwner(case1){
    return case1.owner !== -1;
}

function isOwner(case1, player){
    return case1.owner === player;
}

function pickCard() {
    let card_id = Math.ceil(Math.random() * (chance.length - 1));
    return chance[card_id];
}

function wroteMessage(title, message, text_ok, text_cancel){

    let game = document.getElementById('show_game');
    game.style.display = "block";

    let name = document.getElementById('name_case');
    name.innerHTML = "<b>" + title + "</b>";

    let content = document.getElementById('message');
    content.innerHTML = message;

    let ok = document.getElementById('button_ok');
    ok.innerHTML = text_ok;

    let cancel = document.getElementById('button_cancel');
    if(text_cancel === ""){
        cancel.style.display = "none";
    } else {
        cancel.style.display = "block";
        cancel.innerHTML = text_cancel;
    }

}

function afterMove(player, lancer){

    let card = null;

    let case1 = cases[users[player].position];


    switch(case1.type) {
        case "taxe" :
            if(hasEnoughMoney(player, case1.price)){
                wroteMessage(case1.name, "Vous devez payer " + case1.price + "€.", "Payer", "");
            } else {
                wroteMessage(case1.name, "Vous ne pouvez pas payer cette taxe, vous avez perdu.", "RIP", "");
            }
            break;
        case "rue" :
        case "calanque":
            if(!hasOwner(case1)){
                if(hasEnoughMoney(player, case1.price)){
                    wroteMessage(case1.name, "Prix : " + case1.price + "€" + "<br/>" + "Loyer : " + case1.rent + "€", "Acheter", "Ne pas acheter");
                } else {
                    wroteMessage(case1.name, "Vous n'avez pas assez d'argent pour acheter cette propriété.", "Ok", "");
                }
            } else if (isOwner(case1, player)) {
                wroteMessage(case1.name, "Vous êtes chez vous", "Ok", "");
            } else if (hasEnoughMoney(player, case1.rent)) {
                wroteMessage(case1.name, "Vous devez payer " + case1.rent + "€" + " à " +  users[case1.owner].name + ".", "Payer", "");
            } else {
                wroteMessage(case1.name, "Vous devez payer " + case1.rent + "€" + " à " +  users[case1.owner].name + ". Vous n'avez pas assez d'argent.", "RIP", "");
            }
            break;
        case "compagnie":
            if(!hasOwner(case1)){
                if(hasEnoughMoney(player, case1.price)){
                    wroteMessage(case1.name, "Prix : " + case1.price + "€" + "<br/>" + "Loyer : 4 fois le montant indiqué par les dés", "Acheter", "Ne pas acheter");
                } else {
                    wroteMessage(case1.name, "Vous n'avez pas assez d'argent pour acheter cette compagnie.", "Ok", "");
                }
            } else if (isOwner(case1, player)) {
                wroteMessage(case1.name, "Vous êtes chez vous", "Ok", "");
            } else if (hasEnoughMoney(player, case1.rent)) {
                wroteMessage(case1.name, "Vous devez payer " + lancer*4 + "€" + " à " +  users[case1.owner].name + ".", "Payer", "");
            } else {
                wroteMessage(case1.name, "Vous devez payer " + lancer*4 + "€" + " à " +  users[case1.owner].name + ". Vous n'avez pas assez d'argent.", "RIP", "");
            }
            break;
        case "chance":
        case "communaute":
            card = pickCard();
            if(hasEnoughMoney(player, -1*card.money)){
                let text_ok = "";
                if(card.money > 0){
                    text_ok = "Encaisser";
                } else if(card.money < 0){
                    text_ok = "Payer";
                } else {
                    text_ok = "Y aller";
                }
                wroteMessage(case1.name, card.message, text_ok, "");
            } else {
                wroteMessage(case1.name, card.message + "<br/> Vous n'avez pas assez d'argent, vous avez perdu !", "RIP", "");
            }
            break;
        case "prison":
            wroteMessage(case1.name, "Vous faites une visite à la prison.", "Ok", "");
            break;
        case "go_prison":
            wroteMessage(case1.name, "Vous allez en prison.", "Y aller", "");
            break;
        case "parc":
            wroteMessage(case1.name, "Vous avez fait une étude KSI, vous ramassez l'argent.", "Encaisser", "");
            break;
        case "depart":
            wroteMessage(case1.name, "Vous êtes sur la case départ.", "Ok", "");
            break;
    }

    return card
}

/**
 * 
 * @param {number} player 
 * @returns {{card: number, lancer: number}} card_id (int or null) and dice_roll_value
 */
function rollDice(player){
    let lancer1 = Math.ceil(Math.random() * 6);
    let lancer2 = Math.ceil(Math.random() * 6);

    let dice1 = document.getElementById("dice1");


    switch (lancer1){
        case 1:
            dice1.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-1.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
        case 2:
            dice1.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-2.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
        case 3:
            dice1.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-3.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
        case 4:
            dice1.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-4.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
        case 5:
            dice1.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-5.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
        case 6:
            dice1.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-6.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
    }

    let dice2 = document.getElementById("dice2");

    switch (lancer2){
        case 1:
            dice2.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-1.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
        case 2:
            dice2.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-2.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
        case 3:
            dice2.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-3.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
        case 4:
            dice2.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-4.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
        case 5:
            dice2.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-5.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
        case 6:
            dice2.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-6.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
    }

    let lancer = lancer1 + lancer2;

    let card = null;

    if(users[player].in_prison === -1){

        users[player].position = changePosition(player, lancer);
        card = afterMove(player, lancer);

    } else {

        let message = document.getElementById('message');
        let ok = document.getElementById('button_ok');
        let cancel = document.getElementById('button_cancel');


        let game = document.getElementById('show_game');
        game.style.display = "block";
        let name = document.getElementById('name_case');
        name.innerHTML = "<b> Prison </b>";
        users[player].in_prison += 1;
        if(lancer === 12 || users[player].in_prison === 3){
            message.innerHTML =  "Vous sortez de prison !";
            ok.innerHTML = "Ok";
            users[player].in_prison = -1;
            cancel.style.display = 'none';
        } else {
            message.innerHTML =  "Vous restez en prison. Il reste " + (3 - users[player].in_prison) + " tour(s) avant de pouvoir sortir.";
            ok.innerHTML = "Ok";
            cancel.style.display = 'none';
        }
    }

    return {
        card,
        lancer
    }

}


function click_ok(player, card, lancer, cagnotte){

    let case1 = cases[users[player].position];

    let block = false;

    if(case1.type === "rue" || case1.type === "calanque"){
        if(case1.owner === -1){
            if(case1.price < users[player].money) {
                users[player].properties.push(case1.id);
                users[player].money -= case1.price;
                cases[users[player].position].owner = player;
                let case_html = document.getElementById("case_" + case1.id);
                case_html.classList.add("property" + player);
            }
        } else if (case1.owner !== player) {
            if(case1.rent < users[player].money) {
                users[player].money -= case1.rent;
                users[case1.owner].money += case1.rent;
            } else {
                users[case1.owner].money += users[player].money;
                users[player].money = 0;
                users[player].lost = true;
            }
        }
    } else if (case1.type === "taxe") {
        if(case1.price < users[player].money) {
            users[player].money -= case1.price;
        } else {
            users[player].money = 0;
            users[player].lost = true;
        }
    } else if (case1.type === "go_prison") {
        users[player].position = 11;
        users[player].in_prison = 0;
    } else if (case1.type === "chance" || case1.type === "communaute"){
        if(-1*card.money < users[player].money){
            users[player].money += card.money;
            if(card.money < 0){
                cagnotte += -1*card.money
            }
            if( card.move !== 0){
                users[player].position = card.move;
                if(card.move !== 11){
                    block = true;
                    afterMove(player, lancer);
                }
            }
        } else {
            cagnotte += users[player].money;
            users[player].money = 0;
            users[player].lost = true;
        }

        if(card.prison === 1){
            users[player].position = 11;
            users[player].in_prison = 0;
        }
    } else if (case1.type === "compagnie"){
        if(case1.owner === -1){
            if(case1.price < users[player].money) {
                users[player].properties.push(case1.id);
                users[player].money -= case1.price;
                cases[users[player].position].owner = player;
                let case_html = document.getElementById("case_" + case1.id);
                case_html.classList.add("property" + player);
            }
        } else if (case1.owner !== player) {
            users[player].money -= lancer*4;
            users[case1.owner].money += lancer*4;
        }
    } else if (case1.type === "parc"){
        users[player].money += cagnotte;
        cagnotte = 0;
    }
    if(!block){
        let game = document.getElementById('show_game');
        game.style.display = "none";
    }


    return {cagnotte, block};
}

export { afterMove, rollDice, click_ok }