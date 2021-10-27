const cartes_chance = require("./front/src/assets/chance.json");

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

exports.rollDice = rollDice;
exports.pickCard = pickCard;