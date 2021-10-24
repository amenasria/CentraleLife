const rewire = require('rewire')

const { afterMove, rollDice, click_ok } = require("../src/js/utils")


const utils = {
    afterMove: afterMove,
    rollDice: rollDice,
    click_ok: click_ok,
}

describe("afterMove", () => {
    test("player 0 lancer 5", () => {
        const game = document.getElementById('show_game');
        console.log(game);
        utils.afterMove(0, 5);
        const element = document.getElementById('message');
        expect(element.innerHTML).toBe("Prix : 200€<br>Loyer : 25€");
    })
})
