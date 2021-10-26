import utilsRewire from '../src/js/utils.js';

const { rollDice, click_ok } = require("../src/js/utils");

const utils = {
    changePosition: utilsRewire.__get__('changePosition'),
    hasEnoughMoney: utilsRewire.__get__('hasEnoughMoney'),
    hasOwner: utilsRewire.__get__('hasOwner'),
    isOwner: utilsRewire.__get__('isOwner'),
    inPrison: utilsRewire.__get__('inPrison'),
    goPrison: utilsRewire.__get__('goPrison'),
    dice: utilsRewire.__get__('dice'),
    rollDice: rollDice,
    click_ok: click_ok,
}

describe("changePosition", () => {
    test("player 0 position +5", () => {
        expect(utils.changePosition(0, 5)).toBe(6);
    })
    test("player 1 position +12", () => {
        expect(utils.changePosition(1, 12)).toBe(13);
    })
})

describe("hasEnoughMoney", () => {
    test("player 0 price 200", () => {
        expect(utils.hasEnoughMoney(0, 200)).toBe(true);
    })
    test("player 0 position 2000", () => {
        expect(utils.hasEnoughMoney(0, 2000)).toBe(false);
    })
})

describe("hasOwner", () => {
    test("hasn't owner", () => {
        expect(utils.hasOwner({ "name" : "test", "owner" : -1 })).toBe(false);
    })
    test("has owner", () => {
        expect(utils.hasOwner({ "name" : "test", "owner" : 1 })).toBe(true);
    })
})

describe("inPrison", () => {
    test("isn't in prison", () => {
        expect(utils.inPrison(0)).toBe(false);
    })
    test("is in prison", () => {
        utils.goPrison(0);
        expect(utils.inPrison(0)).toBe(true);
    })
})

describe("dice", () => {
    test("rollDice", () => {
        let {lancer1, lancer2} = utils.dice();
        let check1 = (1 <= lancer1) && (lancer1 <= 6);
        let check2 = (1 <= lancer2) && (lancer2 <= 6);
        expect(check1 && check2).toBe(true);
    })
})