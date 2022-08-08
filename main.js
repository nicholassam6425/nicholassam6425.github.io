//probably don't need to give them defaults, but whatever. redundancy is cool!
var gold = 0;
var stage = 1;
var enemysKilledStage = 0;
var enemyMaxHP = 10;
var enemyHP = 10;
var charList = {};
var partyList = {1: null, 2: null, 3: null, 4: null, 5:null};
var attackInterval = 1000

class character {
    constructor(name) 
    {
        this.name = name;
        this.level = 1;
        this.stats = {
            str: 1, //click damage
            dex: 1, //idle damage
            int: 1, //spellcasting damage
            con: 1, //health
            wis: 1, //mana
            luk: 1, //chance, drop rate, etc
            per: 0, //damage reduction
            pie: 0, //bonuses at certain thresholds
            pat: 0, //click charge
            acc: 0, //crit chance
            ecc: 0, //random reassignment
            grw: 0, //xp gain
            spt: 0, //increase damage dealt based on missing hp
            pty: 0, //more dmg to higher maxhp enemies, but less to lower
            sdm: 0, //more dmg to lower maxhp enemies, but more to higher
            qck: 0, //atk speed up, idle damage down
            pre: 0, //atk speed down, idle damage up
            gen: 0, //drop rate up, damage down
            cha: 0, //other party members damage up
            spd: 0, //atk speed up
            dom: 0, //click damage up
            asc: 0, //spell casting up
            snk: 0, //chance to skip stage
            vrs: 0, //all stats up a little bit
            exp: 0, //choose 1 stat, that stat scaling up
            ten: 0, //cc reduction (??????????????????)
            agi: 0, //dodge chance
            sta: 0, //health up
            hst: 0, //spellcasting cooldown reduction
            mas: 0, //spellcasting effectiveness

            //maybe combine into retaliation or something
            rfl: 0, //reflect damage %
            spk: 0 //reflect damage flat
        };
        this.xp = 0;
        this.nextLevel = 100;
        this.updateCharOutputs();
    }
    upStat(stat) {
        this.stats[stat] += 1
        this.updateCharOutputs();
        selectCharacter(this.name);
    }
    getIdleDamage() {
        return this.idleDamage; 
    }
    getClickDamage() {
        return this.clickDamage;
    }
    updateCharOutputs() {
        this.clickDamage = 1 + this.stats.str;
        this.idleDamage = 0 + this.stats.dex;
    }
};

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
        //if statements are failsafes. don't want to load undefined into these
        if (typeof savegame.gold !== "undefined") {gold = savegame.gold};
        document.getElementById("gold").innerHTML = gold;
        if (typeof savegame.stage !== "undefined") {stage = savegame.stage};
        generateEnemy();
        if (typeof savegame.charList !== "undefined") {charList = savegame.charList};
        if (typeof savegame.partyList !== "undefined") {partyList = savegame.partyList};
        populateCharListDropdown();
    }
    //start autoattacking
    autoAttack();
}

function populateCharListDropdown() {
    var charDiv = document.getElementById("charListDropdown");
    for (const [key, value] of Object.entries(charList)) {
        var btn = document.createElement("button");
        btn.appendChild(document.createTextNode(key));
        btn.addEventListener("click", function() {selectCharacter(key);})
        btn.id = key;
        charDiv.appendChild(btn);
    }
}

function startNewGame() {
    writeToLog("Welcome to x");
    gold = 0;
    stage = 1;
    enemysKilledStage = 0;
    enemyMaxHP = 10;
    enemyHP = 10;
    starterCharacter = new character("John Default");
    charList[starterCharacter.name] = starterCharacter;
    addToParty(5, starterCharacter.name);
    document.getElementById("gold").innerHTML = gold;
    populateCharListDropdown();
}

function addToParty(slot, charname) {
    partyList[slot] = charList[charname];
    var partyButton = document.getElementById("char"+slot);
    partyButton.innerHTML = charname;
    partyButton.addEventListener("click", function() {selectCharacter(charname)})
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

function dropdown() {
    document.getElementById("charListDropdown").classList.toggle("show");
}

function selectCharacter(charname) {
    //disable selected character in charlistdropdown
    toggleButton(document.getElementById(charname));
    ////add to party button - dropdown for 12345 slots
    ////how to check if char is already in party?
    
    var statDisplay = document.getElementById("statDisplay");
    statDisplay.innerHTML = "";
    var toggle = false;
    for (const [key, value] of Object.entries(charList[charname].stats)) {
        var statRow = document.createElement("div");
        statRow.className = "statRow";
        if (toggle) {
            statRow.style.backgroundColor = "darkgray";
            toggle = !toggle;
        } else {
            statRow.style.backgroundColor = "lightgray";
            toggle = !toggle;
        }
        //display all the stats
        var statName = document.createElement("div");
        statName.className = "statName";
        statName.appendChild(document.createTextNode(key.toUpperCase()));
        statRow.appendChild(statName);

        var statValue = document.createElement("div");
        statValue.className = "statValue";
        statValue.appendChild(document.createTextNode(value));
        statRow.appendChild(statValue);
        //upstat button per stat
        var upStatButton = document.createElement("button");
        upStatButton.className = "upStatButton";
        upStatButton.addEventListener("click", function() {charList[charname].upStat(key)});
        upStatButton.appendChild(document.createTextNode("+"))
        var upStat = document.createElement("div");
        upStat.className = "upStat";
        upStat.appendChild(upStatButton);
        statRow.appendChild(upStat);

        statDisplay.appendChild(statRow);
    }
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

function writeToLog(message) {
    document.getElementById("combat-log").innerHTML = document.getElementById("combat-log").innerHTML + message;
    const lines = document.getElementById("combat-log").innerHTML.split("<br>");
    if (lines.length > 10) {
        document.getElementById("combat-log").innerHTML = lines[1];
        for (var i = 2; i < lines.length; i++) {
            document.getElementById("combat-log").innerHTML = document.getElementById("combat-log").innerHTML + "<br>" +lines[i];
        }
    }
}

function calculateAtkInterval() {
    attackInterval = 10000;
}

function updateElements() {
    document.getElementById("enemy").innerHTML = enemyHP + "/" + enemyMaxHP
    document.getElementById("gold").innerHTML = gold;
}

function autoAttack() {
    calculateAtkInterval();
    idleAttack();
    setTimeout(autoAttack, attackInterval);
}

window.onclick = function(event) {
    if (!event.target.matches(".dropdownButton")) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function toggleButton(element) {
    if (!element.disabled) {
        element.disabled = true;
    } else {
        element.disabled = false;
    }
}