require("chromedriver");    // chromedriver helps selenium in finding local installation of chrome and opening it.
const fs = require("fs");
const wd = require("selenium-webdriver");  // selenium is a web automation library which is used to automate browser tasks.
const chrome = require("selenium-webdriver/chrome"); // assisting object to open chrome in headless mode.
const browser = new wd.Builder().forBrowser("chrome").build();   // Initializing, specifying browser and opening/creating its instance in the OS.

const matchID = 30880;
const innings = 1;

// Keys
let battingKeys = ["matches", "innings", "notOut", "runs", "highestScore", "average", "ballsPlayed", "strikeRate", "hundreds", "twoHundreds", "Fifties", "Fours", "Sixes"];
let bowlerKeys = ["matches", "innings", "balls", "runs", "wickets", "bestBowlingInInnings", "bestBowlingInMatch", "economy", "bowlingAverage", "bowlingStrikeRate", "fiveWicketsInning", "tenWicketsMatch"];

// URls for batsmen and bowlers
let batsmenURL = [];
let bowlersURL = [];

// Array to store career data objects
let careerData = [];

let players = 0;

async function getCareerData(url, i, totalPlayers) {
    let browser = new wd.Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build();
    await browser.get(url);
    await browser.wait(wd.until.elementLocated(wd.By.css("table")));

    let tables = await browser.findElements(wd.By.css("table"));

    for (let j in tables) {
        let keys;
        if (j == 0) {
            keys = battingKeys;
        }
        if (j == 1) {
            keys = bowlerKeys;
        }
        let careerObj = {};
        let rows = await tables[j].findElements(wd.By.css("tbody tr"));
        for (let row of rows) {
            let columns = await row.findElements(wd.By.css("td"));
            let matchFormat = await columns[0].getAttribute("innerText");
            let data = {};
            for (let k = 1; k < columns.length; k++) {
                data[keys[k - 1]] = await columns[k].getAttribute("innerText");
            }
            careerObj[matchFormat] = data;
        }
        if (j == 0) {
            careerData[i]["battingCareer"] = careerObj;
        } else {
            careerData[i]["bowlingCareer"] = careerObj;
        }
    }

    await browser.close();
    players++;
    if (players == totalPlayers) {
        fs.writeFileSync("career.json", JSON.stringify(careerData));

    }
}

// Selenium methods are asynchronous, to make them synchronous, we use the following syntax. 
async function main() {

    await browser.get(`https://cricbuzz.com/live-cricket-scores/${matchID}`); // opens the website in browser
    await browser.wait(wd.until.elementLocated(wd.By.css(".cb-nav-bar a"))); // waits until this particular component/element is loaded.

    let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a")); // returns an array of anchor tags 
    await buttons[1].click();

    await browser.wait(wd.until.elementLocated(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`))); // wait till tables are loaded
    let tables = await browser.findElements(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`)); // returns an array of these tables

    // Batsmen
    let batsmenRows = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for (let i = 0; i < batsmenRows.length; i++) {
        let columns = await batsmenRows[i].findElements(wd.By.css("div"));
        if (columns.length == 7) {
            let url = await columns[0].findElement(wd.By.css("a")).getAttribute("href");
            batsmenURL.push(url);
            let playerName = await columns[0].getAttribute("innerText");
            careerData.push({ "playerName": playerName });
        }
    }

    // Bowlers
    let bowlerRows = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for (let i = 0; i < bowlerRows.length; i++) {
        let columns = await bowlerRows[i].findElements(wd.By.css("div"));
        if (columns.length == 8) {
            let url = await columns[0].findElement(wd.By.css("a")).getAttribute("href");
            bowlersURL.push(url);
            let playerName = await columns[0].getAttribute("innerText");
            careerData.push({ "playerName": playerName });
        }
    }

    let finalURLs = batsmenURL.concat(bowlersURL);

    for (let i in finalURLs) {
        getCareerData(finalURLs[i], i, finalURLs.length);
    }

    browser.close();
}

main();

