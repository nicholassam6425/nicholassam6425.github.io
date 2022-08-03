var gold = 0;
var stage = 1;
var enemyMaxHP = 10;
var enemyHP = 10;
var charList = [];
class character {
    constructor() 
    {
        this.level = 1;
        this.stats = {
            str: 1,
            dex: 1,
            int: 1,
            con: 1,
            wis: 1,
            luk: 1,
            per: 0,
            pie: 0,
            pat: 0,
            acc: 0,
            ecc: 0,
            grw: 0,
            spt: 0,
            pty: 0,
            sdm: 0,
            qck: 0,
            pre: 0,
            gen: 0,
            cha: 0,
            spd: 0,
            dom: 0,
            asc: 0,
            snk: 0,
            vrs: 0,
            exp: 0,
            ten: 0,
            agi: 0,
            hst: 0,
            mas: 0,
            rfl: 0,
            spk: 0
        };
        this.xp = 0;
        this.nextLevel = 100;
    }
    upStat(stat) {
        stats[stat] += 1
    }
}
function save() {
    var save = {
    gold: gold,
    stage: stage,
    charList: charList
    };
    localStorage.setItem("save", JSON.stringify(save));
}

function load() {
    var savegame = JSON.parse(localStorage.getItem("save"));
    if (typeof savegame.gold !== "undefined") gold = savegame.gold;
    if (typeof savegame.stage !== "undefined") stage = savegame.stage;
    if (typeof savegame.charList !== "undefined") charList = savegame.charList;
}

function generateEnemy(){
    enemyMaxHP = Math.floor(10 * Math.pow(1.1,stage));
    enemyHP = enemyMaxHP;
}

function clickAttack(){
    attack(1);
}


function attack(dmg){
    enemyHP = enemyHP - dmg;
    document.getElementById("enemy").innerHTML = enemyHP + "/" + enemyMaxHP
}