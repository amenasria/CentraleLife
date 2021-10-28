import cases from '../assets/cases.json'
import chance from '../assets/chance.json'

function afterMove(users, player, lancer, case_id, card_id){

    let card = null;
    let case1 = cases[case_id];
    let message = document.getElementById('message');
    let ok = document.getElementById('button_ok');
    let cancel = document.getElementById('button_cancel');
    let game = document.getElementById('show_game');
    let name = document.getElementById('name_case');
    game.style.display = "block";
    name.innerHTML = "<b>" + case1.name + "</b>";

    //Si c'est une case "taxe", on paye la taxe
    if(case1.type === "taxe"){
        if(case1.price < users[player].money) {
            message.innerHTML = "Vous devez payer " + case1.price + "€.";
            ok.innerHTML = "Payer";
            cancel.style.display = 'none';
        } else {
            message.innerHTML = "Vous ne pouvez pas payer cette taxe, vous avez perdu.";
            ok.innerHTML = "RIP";
            cancel.style.display = 'none';
        }
    }

    if(case1.type === "rue" || case1.type === "calanque"){
        if(case1.owner === -1){
            if(case1.price < users[player].money){
                message.innerHTML =  "Prix : " + case1.price + "€" + "<br/>" + "Loyer : " + case1.rent + "€";
                ok.innerHTML = "Acheter";
                cancel.style.display = "block";
            } else {
                message.innerHTML =  "Vous n'avez pas assez d'argent pour acheter cette propriété.";
                ok.innerHTML = "Ok";
                cancel.style.display = "none";
            }
        }  else if (case1.owner === player) {
            message.innerHTML =  "Vous êtes chez vous";
            ok.innerHTML = "Ok";
            cancel.style.display = 'none';
        } else if (case1.rent < users[player].money) {
            message.innerHTML =  "Vous devez payer " + case1.rent + "€" + " à " +  users[case1.owner].name;
            ok.innerHTML = "Payer";
            cancel.style.display = 'none';
        } else {
            message.innerHTML =  "Vous devez payer " + case1.rent + "€" + " à " +  users[case1.owner].name +". Vous n'avez pas assez d'argent.";
            ok.innerHTML = "RIP";
            cancel.style.display = 'none';
        }
    }

    if(case1.type === "chance" || case1.type === "communaute"){

        console.log(card_id);
        console.log(chance);
        card = chance[card_id];
        if(-1*card.money < users[player].money){
            message.innerHTML =  card.message;
            if(card.money > 0){
                ok.innerHTML = "Encaisser";
            } else if(card.money < 0){
                ok.innerHTML = "Payer";
            } else {
                ok.innerHTML = "Y aller";
            }
        } else {
            message.innerHTML =  card.message + "<br/> Vous n'avez pas assez d'argent, vous avez perdu !";
            ok.innerHTML = "RIP";
        }
        cancel.style.display = 'none';
    }

    if(case1.type === "prison"){
        message.innerHTML =  "Vous faites une visite à la prison.";
        ok.innerHTML = "Ok";
        cancel.style.display = 'none';
    }

    if(case1.type === "go_prison"){
        message.innerHTML =  "Vous allez en prison.";
        ok.innerHTML = "Y aller";
        cancel.style.display = 'none';
    }

    if(case1.type === "parc"){
        message.innerHTML =  "Vous avez fait une étude KSI, vous ramassez l'argent.";
        ok.innerHTML = "Encaisser";
        cancel.style.display = 'none';
    }

    if(case1.type === "compagnie"){
        if(case1.owner === -1){
            if(case1.price < users[player].money) {
                message.innerHTML = "Prix : " + case1.price + "€" + "<br/>" + "Loyer : 4 fois le montant indiqué par les dés";
                ok.innerHTML = "Acheter";
                cancel.style.display = "block";
            } else {
                message.innerHTML =  "Vous n'avez pas assez d'argent pour acheter cette compagnie.";
                ok.innerHTML = "Ok";
                cancel.style.display = "none";
            }
        }  else if (case1.owner === player) {
            message.innerHTML =  "Vous êtes chez vous !";
            ok.innerHTML = "Ok";
            cancel.style.display = 'none';
        } else {
            message.innerHTML =  "Vous devez payer " + lancer*4 + "€" + " à " +  users[case1.owner].name;
            ok.innerHTML = "Payer";
            cancel.style.display = 'none';
        }
    }

    if (case1.type === "depart"){
        message.innerHTML =  "Vous êtes sur la case départ.";
        ok.innerHTML = "Ok";
    }

    return card
}

// /**
//  * 
//  * @param {number} player 
//  * @returns {{card: number, lancer: number}} card_id (int or null) and dice_roll_value
//  */
// function rollDice(player){
//     let lancer1 = Math.ceil(Math.random() * 6);
//     let lancer2 = Math.ceil(Math.random() * 6);

//     let dice1 = document.getElementById("dice1");


//     let card = null;

//         card = afterMove(player, lancer);

//     } else {

//         let message = document.getElementById('message');
//         let ok = document.getElementById('button_ok');
//         let cancel = document.getElementById('button_cancel');


//         let game = document.getElementById('show_game');
//         game.style.display = "block";
//         let name = document.getElementById('name_case');
//         name.innerHTML = "<b> Prison </b>";
//         users[player].in_prison += 1;
//         if(lancer === 12 || users[player].in_prison === 3){
//             message.innerHTML =  "Vous sortez de prison !";
//             ok.innerHTML = "Ok";
//             users[player].in_prison = -1;
//             cancel.style.display = 'none';
//         } else {
//             message.innerHTML =  "Vous restez en prison. Il reste " + (3 - users[player].in_prison) + " tour(s) avant de pouvoir sortir.";
//             ok.innerHTML = "Ok";
//             cancel.style.display = 'none';
//         }
//     }

//     return {
//         card,
//         lancer
//     }

// }


function click_ok(users, player, card, lancer, cagnotte){

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
                    afterMove(users, player, lancer, users[player].position, card.id);
                    
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

export {afterMove, click_ok}