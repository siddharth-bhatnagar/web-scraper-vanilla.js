require("chromedriver"); // to access chrome via node.js

const wd = require("selenium-webdriver"); // selenium web driver is a browser automation library.
const browser = new wd.Builder().forBrowser("chrome").build(); // creating new instance of the browser, initializing it and opening it in OS.

const matchId = 30880; // match ID of the current match whose details are to be scraped from web.
let innings = 1;
let BatsmenColumns = ["playerName", "out", "runs", "ballsPlayed", "fours", "sixes", "strikeRate"];
let inningsOneBatsmen = [];

async function main() {   // selenium methods are asynchronous, so we have to wait for execution of statements to be finished.
    await browser.get(`https://cricbuzz.com/live-cricket-scores/${matchId}`); // wait till the webpage opens in chrome.
    await browser.wait(wd.until.elementLocated(wd.By.css(".cb-nav-bar a"))); // wait till this element loads completely.

    let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a")); // 
    await buttons[1].click();
    await browser.wait(wd.until.elementLocated(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`)));
    let tables = await browser.findElements(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`));
    let inningsOneBatsmenRows = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));

    for (let i = 0; i < (inningsOneBatsmenRows.length - 3); i++) {
        let columns = await inningsOneBatsmenRows[i].findElements(wd.By.css("div"));
        let data = {};
        for (j in columns) {
            if (j != 1) {
                data[BatsmenColumns[j]] = await columns[j].getAttribute("innerText");
            }
        }
        inningsOneBatsmen.push(data);
    }
    console.log(inningsOneBatsmen);
}

main();