function writeToLog(message) {
    document.getElementById("combat-log").innerHTML = document.getElementById("combat-log").innerHTML + message;
    const lines = document.getElementById("combat-log").innerHTML.split("<br>");
    console.log(lines)
    if (lines.length > 10) {
        document.getElementById("combat-log").innerHTML = lines[1];
        for (var i = 2; i < lines.length; i++) {
            document.getElementById("combat-log").innerHTML = document.getElementById("combat-log").innerHTML + "<br>" +lines[i];
        }
    }
}

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
            rfl: 0, //reflect damage
            spk: 0 //reflect damage
        };
        this.xp = 0;
        this.nextLevel = 100;
        this.updateCharOutputs();
    }
    upStat(stat) {
        this.stats[stat] += 1
        this.updateCharOutputs();
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
}