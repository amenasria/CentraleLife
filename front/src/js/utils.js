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

function inPrison(player) {
    return users[player].in_prison !== -1;
}

function goPrison(player) {
    users[player].position = 11;
    users[player].in_prison = 0;
}

function setMoney(player, change){
    users[player].money += change;
}

function buyProperty(player, case_id){
    users[player].properties.push(case_id);
    cases[users[player].position].owner = player;
    let case_html = document.getElementById("case_" + case_id);
    case_html.classList.add("property" + player);
}

function looseProperty(player){
    for(const id in users[player].properties){
        let case_html = document.getElementById("case_" + users[player].properties[id]);
        case_html.classList.remove("property" + player);
    }
    users[player].properties = [];
    cases[users[player].position].owner = -1;
}

function setLoser(player){
    users[player].money = 0;
    users[player].lost = true;
    looseProperty(player);
}

function dice() {
    let lancer1 = Math.ceil(Math.random() * 6);
    let lancer2 = Math.ceil(Math.random() * 6);

    return {
        lancer1,
        lancer2
    };
}

function displayDice(lancer, numberDice){
    let dice = document.getElementById("dice" + numberDice);

    switch (lancer){
        case 1:
            dice.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-1.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
        case 2:
            dice.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-2.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
        case 3:
            dice.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-3.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
        case 4:
            dice.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-4.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
        case 5:
            dice.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-5.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
        case 6:
            dice.innerHTML = "<object type=\"image/svg+xml\" data=\""+require('../assets/dice-6.svg') + "\" width=\"40\" height=\"40\"></object>";
            break;
    }
}

function writeMessage(title, message, text_ok, text_cancel){

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

/* display the right content in the middle */

function afterMove(player, lancer){

    let card = null;

    let case1 = cases[users[player].position];

    switch(case1.type) {
        case "taxe" :
            if(hasEnoughMoney(player, case1.price)){
                writeMessage(case1.name, "Vous devez payer " + case1.price + "€.", "Payer", "");
            } else {
                writeMessage(case1.name, "Vous ne pouvez pas payer cette taxe, vous avez perdu.", "RIP", "");
            }
            break;
        case "rue" :
        case "calanque":
            if(!hasOwner(case1)){
                if(hasEnoughMoney(player, case1.price)){
                    writeMessage(case1.name, "Prix : " + case1.price + "€" + "<br/>" + "Loyer : " + case1.rent + "€", "Acheter", "Ne pas acheter");
                } else {
                    writeMessage(case1.name, "Vous n'avez pas assez d'argent pour acheter cette propriété.", "Ok", "");
                }
            } else if (isOwner(case1, player)) {
                writeMessage(case1.name, "Vous êtes chez vous", "Ok", "");
            } else if (hasEnoughMoney(player, case1.rent)) {
                writeMessage(case1.name, "Vous devez payer " + case1.rent + "€" + " à " +  users[case1.owner].name + ".", "Payer", "");
            } else {
                writeMessage(case1.name, "Vous devez payer " + case1.rent + "€" + " à " +  users[case1.owner].name + ". Vous n'avez pas assez d'argent.", "RIP", "");
            }
            break;
        case "compagnie":
            if(!hasOwner(case1)){
                if(hasEnoughMoney(player, case1.price)){
                    writeMessage(case1.name, "Prix : " + case1.price + "€" + "<br/>" + "Loyer : 4 fois le montant indiqué par les dés", "Acheter", "Ne pas acheter");
                } else {
                    writeMessage(case1.name, "Vous n'avez pas assez d'argent pour acheter cette compagnie.", "Ok", "");
                }
            } else if (isOwner(case1, player)) {
                writeMessage(case1.name, "Vous êtes chez vous", "Ok", "");
            } else if (hasEnoughMoney(player, lancer*4)) {
                writeMessage(case1.name, "Vous devez payer " + lancer*4 + "€" + " à " +  users[case1.owner].name + ".", "Payer", "");
            } else {
                writeMessage(case1.name, "Vous devez payer " + lancer*4 + "€" + " à " +  users[case1.owner].name + ". Vous n'avez pas assez d'argent.", "RIP", "");
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
                writeMessage(case1.name, card.message, text_ok, "");
            } else {
                writeMessage(case1.name, card.message + "<br/> Vous n'avez pas assez d'argent, vous avez perdu !", "RIP", "");
            }
            break;
        case "prison":
            writeMessage(case1.name, "Vous faites une visite à la prison.", "Ok", "");
            break;
        case "go_prison":
            writeMessage(case1.name, "Vous allez en prison.", "Y aller", "");
            break;
        case "parc":
            writeMessage(case1.name, "Vous avez fait une étude KSI, vous ramassez l'argent.", "Encaisser", "");
            break;
        case "depart":
            writeMessage(case1.name, "Vous êtes sur la case départ.", "Ok", "");
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

    let {lancer1, lancer2} = dice();
    displayDice(lancer1, 1);
    displayDice(lancer2, 2);
    let lancer = lancer1 + lancer2;

    let card = null;

    if(!inPrison(player)){
        users[player].position = changePosition(player, lancer);
        card = afterMove(player, lancer);
    } else {
        users[player].in_prison += 1;
        if(lancer === 12 || users[player].in_prison === 3){
            users[player].in_prison = -1;
            writeMessage("<b> Prison </b>", "Vous sortez de prison !", "Ok", "");
        } else {
            writeMessage("<b> Prison </b>", "Vous restez en prison. Il reste " + (3 - users[player].in_prison) + " tour(s) avant de pouvoir sortir.", "Ok", "");
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

    switch (case1.type){
        case "rue":
        case "calanque":
            if(!hasOwner(case1)){
                if(hasEnoughMoney(player, case1.price)) {
                    setMoney(player, -1*case1.price);
                    buyProperty(player, case1.id);
                }
            } else if (!isOwner(case1, player)) {
                if(hasEnoughMoney(player, case1.rent)) {
                    setMoney(player, -1*case1.rent);
                    setMoney(case1.owner, case1.rent);
                } else {
                    setMoney(case1.owner, users[player].money);
                    setLoser(player);
                }
            }
            break;
        case "taxe":
            if(hasEnoughMoney(player, case1.price)) {
                setMoney(player, -1*case1.price);
            } else {
                setLoser(player);
            }
            break;
        case "go_prison":
            goPrison(player);
            break;
        case "chance":
        case "communaute":
            if(hasEnoughMoney(player, -1*card.money)){
                setMoney(player, card.money);
                if(card.money < 0){
                    cagnotte += -1*card.money
                }
                if(card.move !== 0){
                    users[player].position = card.move;
                    if(card.move !== 11){
                        block = true;
                        afterMove(player, lancer);
                    }
                }
            } else {
                cagnotte += users[player].money;
                setLoser(player);
            }

            if(card.prison === 1){
                goPrison(player);
            }
            break;
        case "compagnie":
            if(!hasOwner(case1)){
                if(hasEnoughMoney(player, case1.price)) {
                    setMoney(player, -1*case1.price);
                    buyProperty(player, case1.id);
                }
            } else if (case1.owner !== player) {
                setMoney(player, -1*lancer*4);
                setMoney(case1.owner, lancer*4);
            }
            break;
        case "parc":
            setMoney(player, cagnotte);
            cagnotte = 0;
            break;
    }

    if(!block){
        let game = document.getElementById('show_game');
        game.style.display = "none";
    }

    return {cagnotte, block};
}

export {
    rollDice,
    click_ok
}