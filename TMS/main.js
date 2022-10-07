//probably don't need to give them defaults, but whatever. redundancy is cool!
var gold = 0;
var stage = 1;
var enemysKilledStage = 0;
var enemyMaxHP = 10;
var enemyHP = 10;
var charList = {};
var partyList = { 1: null, 2: null, 3: null, 4: null, 5: null };
var attackInterval = 1000
var partyClickDamage = 0;
var partyIdleDamage = 0;
var partyAtkSpeed = 0;
var currentlySelected = null;

//load on startup
load();

function updatePartyOutputs() {
    //set to 0
    partyClickDamage = 0;
    partyIdleDamage = 0;
    partyAtkSpeed = 0;
    //iterate through party list then add to total
    for (const [key, value] of Object.entries(partyList)) {
        if (value !== null) {
            partyClickDamage += value.getClickDamage()
            partyIdleDamage += value.getIdleDamage()
            partyAtkSpeed += value.getAtkSpeed();
        }
    }

}

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
        if (typeof savegame.gold !== "undefined") { gold = savegame.gold };
        document.getElementById("gold").innerHTML = gold;
        if (typeof savegame.stage !== "undefined") { stage = savegame.stage };
        generateEnemy();
        if (typeof savegame.charList !== "undefined") { charList = savegame.charList };
        if (typeof savegame.partyList !== "undefined") { partyList = savegame.partyList };
        populateCharListDropdown();
    }
    //start autoattacking
    autoAttack();
    //update party outputs for stuff
    updatePartyOutputs();
}

function populateCharListDropdown() {
    var charDiv = document.getElementById("charListDropdown");
    for (const [key, value] of Object.entries(charList)) {
        var btn = document.createElement("button");
        btn.appendChild(document.createTextNode(key));
        btn.addEventListener("click", function () { selectCharacter(key); })
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
    var partyButton = document.getElementById("char" + slot);
    partyButton.innerHTML = charname;
    partyButton.addEventListener("click", function () { selectCharacter(charname) })
}

function clearSave() {
    var deleteConfirmation = confirm("This will DELETE your save. Are you sure?");
    if (deleteConfirmation) {
        localStorage.removeItem("save");
        document.getElementById("combat-log").innerHTML = "";
        startNewGame();
    }
}

function generateEnemy() {
    gold = gold + Math.floor(1 * Math.pow(1.1, stage - 1));
    enemyMaxHP = Math.floor(10 * Math.pow(1.1, stage - 1));
    enemyHP = enemyMaxHP;
}

function dropdown() {
    document.getElementById("charListDropdown").classList.toggle("show");
}

function deselect() {
    toggleButton(document.getElementById(currentlySelected.name));
    currentlySelected.selected = false;
}

function selectCharacter(charname) {
    //disable selected character in charlistdropdown
    toggleButton(document.getElementById(charname));
    //toggle off currently selected character
    if (currentlySelected != null)
    {
        deselect();
    }
    charList[charname].selected = true;
    currentlySelected = charList[charname];
    ////add to party button - dropdown for 12345 slots
    ////how to check if char is already in party?

    //current sp display
    updateDisplayedSP(charList[charname]);
    
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
        //display all the stats + their values
        var statName = document.createElement("div");
        statName.className = "statName";
        statName.appendChild(document.createTextNode(key.toUpperCase()));
        statRow.appendChild(statName);

        var statValue = document.createElement("div");
        statValue.className = "statValue";
        statValue.appendChild(document.createTextNode(value.value));
        statRow.appendChild(statValue);

        //upstat button per stat
        var upStatButton = document.createElement("button");
        upStatButton.className = "upStatButton";
        upStatButton.addEventListener("click", function () { charList[charname].upStat(key) });
        upStatButton.appendChild(document.createTextNode("+"))
        var upStat = document.createElement("div");
        upStat.className = "upStat";
        upStat.appendChild(upStatButton);
        statRow.appendChild(upStat);

        statDisplay.appendChild(statRow);
    }
}

function updateDisplayedSP(chara) {
    console.log(chara);
    document.getElementById("spdisplay").innerHTML = chara.sp;
}

function clickAttack() {
    attack(partyClickDamage);
    writeToLog("<br>Clicked for " + partyClickDamage + " damage.");
}

function idleAttack() {
    if (partyIdleDamage > 0) {
        attack(partyIdleDamage);
        writeToLog("<br>Idly attacked for " + partyIdleDamage + " damage.");
    }
}

//handles taking damage, enemy dying, xp distribution, stage completion
function attack(dmg) {
    enemyHP = enemyHP - dmg;
    if (enemyHP <= 0) {
        //enemy death
        
        writeToLog("<br>Killed the enemy! Gained " + stage + "g!");

        //stage
        enemysKilledStage = enemysKilledStage + 1;
        if (enemysKilledStage >= 10) {
            //stage completion
            writeToLog("<br>Stage advance! Moved to stage " + (stage + 1));
            enemysKilledStage = 0;
            stage = stage + 1;
            document.getElementById("stage").innerHTML = stage;
        }

        //xp distribution
        for (const [key, value] of Object.entries(partyList)) {
            if (value !== null) {
                value.getXP(Math.floor(Math.pow(1.5, stage)));
            }
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
            document.getElementById("combat-log").innerHTML = document.getElementById("combat-log").innerHTML + "<br>" + lines[i];
        }
    }
}

function calculateAtkInterval() {
    attackInterval = (100/(100+partyAtkSpeed))*10000;
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

window.onclick = function (event) {
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