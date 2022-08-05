import "./utilities.js";

var gold = 0;
var stage = 1;
var enemysKilledStage = 0;
var enemyMaxHP = 10;
var enemyHP = 10;
var charList = [];
var partyList = {1: null, 2: null, 3: null, 4: null, 5:null};
var attackInterval = 1000

//load on startup
load();

//save function
function save() {
    //make dict of relevant data
    var save = {
    gold: gold,
    stage: stage,
    charList: charList,
    partyList: partyList
    };
    //dump it into local storage
    console.log("GAME SAVED. GAME DATA: ")
    console.log(save)
    localStorage.setItem("save", JSON.stringify(save));
}

//load function
function load() {
    //read from local storage
    var savegame = JSON.parse(localStorage.getItem("save"));
    //if no savegame, start new game
    if (savegame === null) {
        startNewGame();
    }
    else {
        //log stuff, then load
        document.getElementById("combat-log").innerHTML = document.getElementById("combat-log").innerHTML + "Save state found. Loading."
        console.log(savegame)
        //if statements are failsafes
        if (typeof savegame.gold !== "undefined") gold = savegame.gold;
        document.getElementById("gold").innerHTML = gold;
        if (typeof savegame.stage !== "undefined") stage = savegame.stage;
        generateEnemy();
        if (typeof savegame.charList !== "undefined") charList = savegame.charList;
        if (typeof savegame.partyList !== "undefined") partyList = savegame.partyList;
    }
}

function startNewGame() {
    writeToLog("Welcome to x");
    gold = 0;
    stage = 1;
    enemysKilledStage = 0;
    enemyMaxHP = 10;
    enemyHP = 10;
    charList = [new character("John Default")];
    partyList[5] = (charList[0])
    document.getElementById("gold").innerHTML = gold;
}

function clearSave() {
    var deleteConfirmation = confirm("This will DELETE your save. Are you sure?");
    if (deleteConfirmation) {
        localStorage.removeItem("save");
        document.getElementById("combat-log").innerHTML = "";
        startNewGame();
    }
}

function generateEnemy(){
    gold = gold + Math.floor(1 * Math.pow(1.1, stage-1));
    enemyMaxHP = Math.floor(10 * Math.pow(1.1, stage-1));
    enemyHP = enemyMaxHP;
}

function selectPartyCharacter(num) {
    document.getElementById("currentCharStats").innerHTML = "<div class=\"charDropdown\"><button onclick=\"console.log(\"click\")\">test</button></div>"
}
function clickAttack(){
    var damage = 1;
    attack(damage);
    writeToLog("<br>Clicked for " + damage + " damage.");
}

function idleAttack(){
    var damage = 0;
    if (damage > 0) {
        attack(damage);
        writeToLog("<br>Idly attacked for " + damage + " damage.");
    }
}

function attack(dmg){
    enemyHP = enemyHP - dmg;
    if (enemyHP <= 0) {
        writeToLog("<br>Killed the enemy! Gained " + stage + "g!");
        enemysKilledStage = enemysKilledStage + 1;
        if (enemysKilledStage >= 10) {
            writeToLog("<br>Stage advance! Moved to stage " + (stage+1));
            enemysKilledStage = 0;
            stage = stage + 1;
        }
        generateEnemy();
    }
    updateElements();
}


function calculateAtkInterval() {
    attackInterval = 1000
}

function updateElements() {
    document.getElementById("enemy").innerHTML = enemyHP + "/" + enemyMaxHP
    document.getElementById("gold").innerHTML = gold;
}

window.setInterval(function(){
    calculateAtkInterval();
    idleAttack();
}, attackInterval)