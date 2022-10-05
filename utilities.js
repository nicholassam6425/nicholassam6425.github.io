

class stat {
    constructor(value = 0, cost = 1, scaling = 1) {
        this.value = value;
        this.cost = cost;
        this.scaling = scaling;
    }
}

class statlist {
    constructor() {
        this.str = new stat(1) //click damage
        this.dex = new stat(1) //idle damage
        this.int = new stat(1) //spellcasting damage
        this.con = new stat(1) //health
        this.wis = new stat(1) //mana
        this.luk = new stat(1) //chance, drop rate, etc
        this.per = new stat() //damage reduction
        this.pie = new stat() //bonuses at certain thresholds
        this.pat = new stat() //click charge
        this.acc = new stat() //crit chance
        this.ecc = new stat() //random reassignment
        this.grw = new stat() //xp gain
        this.spt = new stat() //increase damage dealt based on missing hp
        this.pty = new stat() //more dmg to higher maxhp enemies, but less to lower
        this.sdm = new stat() //more dmg to lower maxhp enemies, but more to higher
        this.qck = new stat() //atk speed up, idle damage down
        this.pre = new stat() //atk speed down, idle damage up
        this.gen = new stat() //drop rate up, damage down
        this.cha = new stat() //other party members damage up
        this.spd = new stat() //atk speed up
        this.dom = new stat() //click damage up
        this.asc = new stat() //spell casting up
        this.snk = new stat() //chance to skip stage
        this.vrs = new stat() //all stats up a little bit
        this.exp = new stat() //choose 1 stat, that stat scaling up
        this.ten = new stat() //cc reduction (??????????????????)
        this.agi = new stat() //dodge chance
        this.sta = new stat() //health up
        this.hst = new stat() //spellcasting cooldown reduction
        this.mas = new stat() //spellcasting effectiveness
        //maybe combine into retaliation or something
        this.rfl = new stat() //reflect damage %
        this.spk = new stat() //reflect damage flat
    }
};

class character {
    constructor(name) {
        this.name = name;
        this.level = 1;
        this.stats = new statlist();
        this.xp = 0;
        this.nextLevel = 100;
        this.sp = 0;
        this.selected = false;
        this.updateCharOutputs();
    }
    //upgrade a stat
    upStat(stat) {
        if (this.sp > 0) 
        {
            this.sp -= 1;
            this.stats[stat].value += 1
            this.updateCharOutputs();
            selectCharacter(this.name);
            if (this.selected) {
                updateDisplayedSP(this);
            }
        }
    }
    //idle damage getter
    getIdleDamage() {
        return this.idleDamage;
    }
    //click damage getter
    getClickDamage() {
        return this.clickDamage;
    }
    getAtkSpeed() {
        return this.stats.qck.value - this.stats.pre.value;
    }
    takeDamage() {
        //health/dying here
    }
    getXP(gainedXP) {
        this.xp += gainedXP;
        //use while to handle levelling up multiple times
        while (this.xp >= this.nextLevel) {
            this.xp -= this.nextLevel;
            this.level += 1;
            this.sp += 1;
        }
        if (this.selected) {
            updateDisplayedSP(this);
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