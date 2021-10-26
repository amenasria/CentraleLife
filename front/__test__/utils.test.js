const rewire = require('rewire')

const utilsRewire = rewire('../src/js/utils');

const { rollDice, click_ok } = require("../src/js/utils");

const utils = {
    changePosition: utilsRewire.__get__('changePosition'),
    rollDice: rollDice,
    click_ok: click_ok,
}

describe("change Position", () => {
    test("player 0 position +5", () => {
        expect(utils.changePosition(0, 5)).toBe(6);
    })
})
