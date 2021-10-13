import users from '../assets/users.json'
import cases from '../assets/cases.json'


function rollDice(player){
    let lancer = Math.ceil(Math.random() * (12 - 1) + 1);
    users[player].position = (users[player].position + lancer)  ;
    if(users[player].position > 40){
        users[player].position = (users[player].position - 40);
    }

    //On recupère la case sur lequel le joueur vient d'arriver
    let case1 = cases[users[player].position];
    let game = document.getElementById('show_game');
    game.style.display = "block";


    console.log(case1.name, case1.type);


    let name = document.getElementById('name_case');
    let message = document.getElementById('message');
    let ok = document.getElementById('button_ok');
    let cancel = document.getElementById('button_cancel');
    name.innerHTML = "<b>" + case1.name + "</b>";

    //Si c'est une case "taxe", on paye la taxe
    if(case1.type === "taxe"){
        message.innerHTML = "Vous devez payer " + case1.price + "€.";
        ok.innerHTML = "Payer";
        cancel.style.display = 'none';
    }

    if(case1.type === "rue" || case1.type === "calanque"){
        message.innerHTML =  "Prix : " + case1.price + "€" + "<br/>" + "Loyer : " + case1.rent + "€";
        ok.innerHTML = "Acheter";
        cancel.style.display = "block";
    }

    if(case1.type === "chance" || case1.type === "communaute"){
        message.innerHTML =  "Message de la carte";
        ok.innerHTML = "C'est parti !";
        cancel.style.display = 'none';
    }

    if(case1.type === "prison"){
        message.innerHTML =  "Vous faites une visite à la prison.";
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

    return case1.id;

}

function click_ok(player){
    let case1 = cases[users[player].position];

    if(case1.type === "rue" || case1.type === "calanque"){
        users[player].properties.push(case1.id);
        users[player].money -= case1.price;
    } else if (case1.type === "taxe") {
        users[player].money -= case1.price;
    } else if (case1.type === "go_prison") {
        users[player].position = 10;
    }

    let game = document.getElementById('show_game');
    game.style.display = "none";

}

export {rollDice, click_ok}