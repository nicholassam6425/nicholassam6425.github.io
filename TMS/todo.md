1. possible to fuck with the game possibly by setting charnames to element ids
    - idk
2. figure out how stats interact with party. i.e add up or take max or whatever?
    - stat dependent. will figure out later.
3. should idle damage crit? maybe reduced crit damage on idle?
4. unique monsters, like how trimps or tap titans does it
    - monsters that skip stages, increase gold drop, increase item drop, recover mana, etc
5. bigint support?
6. settings
# stats to implement (system):
- ~~str (click damage)~~
- ~~dex (idle damage)~~
- int (spell casting)
- con (health)
- wis (spell casting)
- luk (~~crits~~, drops)
- per (health)
- pie (piety)
- pat (patience)
- ~~acc (crits)~~
- ecc (eccentrism)
- grw (exp, levelling)
- spt (spite)
- pty (pity)
- sdm (sadism)
- qck (attack speed)
- pre (attack speed)
- gen (drops, damage)
- cha (party damage)
- spd (attack speed)
- ~~dom (click damage)~~ ** need to give it proper scaling
- asc (spell casting)
- snk (stage skip)
- vrs (stat scaling)
- exp (stat scaling)
- ten 
- agi (health, dodge)
- sta (health)
- hst (spell casting)
- mas (spell casting)
- rfl (health)
- spk (health)
# possible issues
- characters in the party are saved as separate entities than their charlist self. could cause an issue. should be a relatively easy fix. gonna keep doing it this way until the tech debt is too insane tho.
# currently working on:
implementing stats
- ~~crits~~
- health & enemy dealing damage
- character death
# notes ( u can ignore :) ):
- str: party total
- dex: party total
- int: char
- con: char
- wis: char
- luk: party max
- per: char
- pie: char
- pat: party total
- acc: party max
- ecc: char
- grw: char
- spt: char
- pty: party total
- sdm: party total
- qck: party total
- pre: party total
- gen: party total???
- cha: char
- spd: party total
- dom: party total
- asc: char
- snk: party max
- vrs: char
- exp: char
- ten: char
- agi: char
- sta: char
- hst: char
- mas: char
- rfl: char
- spk: char
