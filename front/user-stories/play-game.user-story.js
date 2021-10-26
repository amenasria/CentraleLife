var fs = require('fs');
const url = 'http://localhost:8080/'

const {By, Key} = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');

beforeEach(() => {
    require('chromedriver');
    browser = new webdriver.Builder().forBrowser('chrome').build()
})

test('create room', async () => {
    // files saved in ./reports/screenshots by default
    await browser.get(url);
    await browser.findElement(By.id("creer_salle")).click();
}, 10000)

test('roll dice', async () => {
    // files saved in ./reports/screenshots by default
    await browser.get(url);
    await browser.findElement(By.id("creer_salle")).click();
    await browser.switchTo().defaultContent();
    await browser.findElement(By.id("button_dice")).click();

    browser.takeScreenshot().then((data) => {
        fs.writeFileSync('img.png', data, 'base64')
    })
}, 10000)

test('play game', async () => {
    // files saved in ./reports/screenshots by default
    await browser.get(url);
    await browser.findElement(By.id("creer_salle")).click();
    await browser.switchTo().defaultContent();
    await browser.findElement(By.id("button_dice")).click();
    await browser.findElement(By.id("button_ok")).click();

    browser.takeScreenshot().then((data) => {
        fs.writeFileSync('img.png', data, 'base64')
    })
}, 10000)

afterEach(async () => {
    await browser.quit()
})