

class stat {
    constructor(value, cost, scaling) {
        this.value = value;
        this.cost = cost;
        this.scaling = scaling;
    }
}

class statlist {
    constructor() {
        this.str = new stat(1, 1, 1) //click damage
        this.dex = new stat(1, 1, 1) //idle damage
        this.int = new stat(1, 1, 1) //spellcasting damage
        this.con = new stat(1, 1, 1) //health
        this.wis = new stat(1, 1, 1) //mana
        this.luk = new stat(1, 1, 1) //chance, drop rate, etc
        this.per = new stat(0, 1, 1) //damage reduction
        this.pie = new stat(0, 1, 1) //bonuses at certain thresholds
        this.pat = new stat(0, 1, 1)  //click charge
        this.acc = new stat(0, 1, 1) //crit chance
        this.ecc = new stat(0, 1, 1) //random reassignment
        this.grw = new stat(0, 1, 1) //xp gain
        this.spt = new stat(0, 1, 1) //increase damage dealt based on missing hp
        this.pty = new stat(0, 1, 1) //more dmg to higher maxhp enemies, but less to lower
        this.sdm = new stat(0, 1, 1) //more dmg to lower maxhp enemies, but more to higher
        this.qck = new stat(0, 1, 1) //atk speed up, idle damage down
        this.pre = new stat(0, 1, 1) //atk speed down, idle damage up
        this.gen = new stat(0, 1, 1) //drop rate up, damage down
        this.cha = new stat(0, 1, 1) //other party members damage up
        this.spd = new stat(0, 1, 1) //atk speed up
        this.dom = new stat(0, 1, 1) //click damage up
        this.asc = new stat(0, 1, 1) //spell casting up
        this.snk = new stat(0, 1, 1) //chance to skip stage
        this.vrs = new stat(0, 1, 1) //all stats up a little bit
        this.exp = new stat(0, 1, 1) //choose 1 stat, that stat scaling up
        this.ten = new stat(0, 1, 1) //cc reduction (??????????????????)
        this.agi = new stat(0, 1, 1) //dodge chance
        this.sta = new stat(0, 1, 1) //health up
        this.hst = new stat(0, 1, 1) //spellcasting cooldown reduction
        this.mas = new stat(0, 1, 1) //spellcasting effectiveness
        //maybe combine into retaliation or something
        this.rfl = new stat(0, 1, 1) //reflect damage %
        this.spk = new stat(0, 1, 1) //reflect damage flat
    }
};

class character {
    constructor(name) {
        this.name = name;
        this.level = 1;
        this.stats = new statlist();
        this.xp = 0;
        this.nextLevel = 100;
        this.updateCharOutputs();
    }
    //upgrade a stat
    upStat(stat) {
        this.stats[stat].value += 1
        this.updateCharOutputs();
        selectCharacter(this.name);
    }
    //idle damage getter
    getIdleDamage() {
        return this.idleDamage;
    }
    //click damage getter
    getClickDamage() {
        return this.clickDamage;
    }
    takeDamage() {
        //health/dying here
    }
    getXP(gainedXP) {
        this.xp += gainedXP;
        //use while to handle levelling up twice
        while (this.xp >= this.nextLevel) {
            this.xp -= this.nextLevel;
            this.level += 1;
        }
    }
    //called when: upgrading stat, equipping items.
    updateCharOutputs() {
        this.clickDamage = 
        (this.stats.str.value * this.stats.str.scaling) +
        (this.stats.dom.value * this.stats.dom.scaling);

        this.idleDamage = 
        (this.stats.dex.value * this.stats.dex.scaling);
        updatePartyOutputs();
    }
};