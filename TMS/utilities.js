

class stat {
    constructor(value = 0, cost = 1, scaling = 1) {
        this.value = value;
        this.cost = cost;
        this.scaling = scaling;
        this.scaled_value = value * scaling;
    }
    add(num) { 
        this.value += num;
        this.scaled_value = value * scaling
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
        this.nextLevel = 10;
        this.sp = 0;
        this.selected = false;
        this.maxHP = 10 + ((this.stats.con.value * this.stats.con.scaling) * (this.stats.per+1));
        this.currentHP = maxHP;
        this.updateCharOutputs();
        this.data = {};
        this.alive = true;
    }
    //upgrade a stat
    upStat(stat) {
        if (this.sp >= this.stats[stat].cost) {
            this.sp -= this.stats[stat].cost;
            this.stats[stat].add(1);
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
    getCritChance() {
        return this.stats.luk.value + this.stats.acc.value
    }
    getCritDamage() {
        return 1;
    }
    takeDamage(damageTaken) {
        writeToLog("<br>" + this.name + " took " + damageTaken + " damage")
        this.currentHP -= damageTaken;
        this.data['partyButton'].innerHTML = this.name + "<br>" + this.currentHP + "/" + this.maxHP;
        if (this.currentHP <= 0) {
            this.die();
            toggleButton(this.data['partyButton'])
            return 
        }

    }
    die() {
        writeToLog("<br>lole u r dead")
        this.alive = false;
        this.updateCharOutputs()
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
        if (this.alive) {
            this.clickDamage =
                (this.stats.str.value * this.stats.str.scaling) +
                (this.stats.dom.value * this.stats.dom.scaling);

            this.idleDamage =
                (this.stats.dex.value * this.stats.dex.scaling);
        }
        else {
            this.clickDamage = 0
            this.idleDamage = 0
        }
        updatePartyOutputs();
    }
};