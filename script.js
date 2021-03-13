require("chromedriver");    // chromedriver helps selenium in finding local installation of chrome and opening it.

const wd = require("selenium-webdriver");  // selenium is a web automation library which is used to automate browser tasks.
const chrome = require("selenium-webdriver/chrome");
const browser = new wd.Builder().forBrowser("chrome").setChromeOptions(new chrome.Options().headless()).build();   // Initializing, specifying browser and opening/creating its instance in the OS.

const matchID = 30880;
const innings = 1;

// Keys
let batsmenKeys = ["playerName", "out", "runs", "ballsPlayed", "fours", "sixes", "strikeRate"];
let bowlerKeys = ["playerName","overs", "maiden", "runs", "wickets", "noBalls", "whiteBalls", "Economy"];

let batsmenStatistics = [];
let bowlerStatistics = [];

// Selenium methods are asynchronous, to make them synchronous, we use the following syntax. 
async function main() {
    await browser.get(`https://cricbuzz.com/live-cricket-scores/${matchID}`); // opens the website in browser
    await browser.wait(wd.until.elementLocated(wd.By.css(".cb-nav-bar a"))); // waits until this particular component/element is loaded.

    let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a")); // returns an array of anchor tags 
    await buttons[1].click();

    await browser.wait(wd.until.elementLocated(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`))); // wait till tables are loaded
    let tables = await browser.findElements(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`)); // returns an array of these tables
    
    // Batsmen
    let batsmenTableRows = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));

    for(let i = 0; i < (batsmenTableRows.length - 3); i++) {
        let batsmenTableColumns = await batsmenTableRows[i].findElements(wd.By.css("div"));
        let dataObject = {};
        for(j in batsmenTableColumns) {
            if(j!=1){
                dataObject[batsmenKeys[j]] = await batsmenTableColumns[j].getAttribute("innerText");
            }
        }
        batsmenStatistics.push(dataObject);
    }

    // Bowlers
    let bowlerTableRows = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
   
    for(let i=0;i<bowlerTableRows.length;i++) {
        let bowlerTableColumns = await bowlerTableRows[2].findElements(wd.By.css("div"));
        let data = {};
        for(j in bowlerTableColumns) {
            data[bowlerKeys[j]] = await bowlerTableColumns[j].getAttribute("innerText");
        }
        bowlerStatistics.push(data);
    }

    console.log(batsmenStatistics);
    console.log("--------------------------------------");
    console.log(bowlerStatistics);

}

main();
  
