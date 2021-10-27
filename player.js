const cartes_chance = require("./front/src/assets/chance.json");
const cases = require("./front/src/assets/cases.json");

class Player {
    constructor(id, name, color, money, position, in_prison, properties) {
      this.id = id;
      this.name = name
      this.color = color;
      this.money = money;
      this.position = position;
      this.in_prison = in_prison;
      this.properties = properties;
    }
  }


/**
 * Rolling 2 dices and returning their value as a tuple and the player with its new position.
 * @param {Player} player
 * @returns {{lancer1: number, lancer2: number, player: Player}} dice's roll value & modified player
 */
function rollDice(player){
    let lancer1 = Math.ceil(Math.random() * 6);
    let lancer2 = Math.ceil(Math.random() * 6);
    player.position += lancer1 + lancer2;
    return [lancer1, lancer2, player]
}


/**
 * Picking a random card in the cards array and return its id and the player with its new position/money/in_prison.
 * @param {Player} player 
 * @returns {{card_id, Player}} card id & modified Player.
 */
function pickCard(player){
    let card_id = Math.ceil(Math.random() * (chance.length - 1));
    let carte_chance = cartes_chance[card_id];
    // Updating money, position and in_prison attributes depending on the carte_chance values
    player.money += carte_chance.money;
    player.position = carte_chance.move === 0 ? player.position : carte_chance.move;
    player.in_prison += carte_chance.prison;
    return [card_id, player]
}


/**
 * Making an action depending on the case the player is on.
 * @param {Player} player Current user playing
 * @param {String} action Action he chose on the board (buy or pass)
 * @returns {{String, Player}} Returns an action and the modified Player.
 */
function makeAction(player, action){
    let current_case = cases[player.position];
    let owner_id = doesCaseBelongToPlayer(current_case, players);
    if (owner_id === player.id) { // If you're home, do nothing
        return ["home", player]
    } else if (owner_id >= 0) { // If you're on someone else property, pay him rent
        player.money -= current_case.rent
        return ["had_to_pay", player]
    } else if (owner_id === -1) { // If you're on no-one's property
        switch (current_case.type) {
            case "taxe":
                player.money -= current_case.price;
                break;
            case "rue":
            case "calanque":
            case "compagnie":
                if (action === "acheter") {
                    if (player.money - current_case.price > 0) {
                        player.money -= current_case.price;
                        player.properties.push(player.position);
                        return ["just_bought", player]
                    } else {
                        return ["couldnt_bought", player]
                    }                    
                };
                break;
            case "chance":
            case "communaute":
                return ["card", player]
            case "prison":
                return ["visiting_prison", player]
            case "go_prison":
                player.in_prison = 0;
                return ["in_prison", player]
            case "parc":
                return ["parc", player]
            case "depart":
                player.money += current_case.money
                return ["depart", player]
        }
    }
}

/**
 * Check if the case belongs to any Player
 * @param {Case} case_board
 * @param {Array.<Player>} players 
 * @returns {Number} The id of the player it belongs to or -1 if it doesn't belong to anyone.
 */
function doesCaseBelongToPlayer(case_board, players) {
    output = -1;
    players.forEach(player => {
        if (player.properties.includes(case_board.id)) {
            output = player.id;
        }
    });
    return output
}

exports.rollDice = rollDice;
exports.pickCard = pickCard;
exports.makeAction = makeAction;
