import {
  buildFaction,
  buildFighter,
  buildFighterClass,
  buildFighterPrototype,
  buildGang,
  buildGangDetail,
} from "./generator";

const factionGoliath = buildFaction({ name: "Goliath" });
const factionEscher = buildFaction({ name: "Escher" });
const factionOrlock = buildFaction({ name: "Orlock" });
const factionVanSaar = buildFaction({ name: "VanSaar" });
const factionCawdor = buildFaction({ name: "Cawdor" });
const factionDelaque = buildFaction({ name: "Delaque" });

export const factions = [
  factionGoliath,
  factionEscher,
  factionOrlock,
  factionVanSaar,
  factionCawdor,
  factionDelaque,
];

const fcLeader = buildFighterClass({ name: "Leader" });
const fcChampion = buildFighterClass({ name: "Champion" });
const fcGanger = buildFighterClass({ name: "Ganger" });
const fcJuve = buildFighterClass({ name: "Juve" });
const fcProspect = buildFighterClass({ name: "Prospect" });

export const fighterClasses = [fcLeader, fcChampion, fcGanger, fcJuve];

const fpForgeTyrant = buildFighterPrototype({
  name: "Forge Tyrant",
  faction: factionGoliath,
  fighterClass: fcLeader,
  cost: 135,
});
const fpForgeBoss = buildFighterPrototype({
  name: "Forge Boss",
  faction: factionGoliath,
  fighterClass: fcChampion,
  cost: 100,
});
const fpStimmer = buildFighterPrototype({
  name: "Stimmer",
  faction: factionGoliath,
  fighterClass: fcChampion,
  cost: 125,
});
const fpForgeBorm = buildFighterPrototype({
  name: "Forge-born",
  faction: factionGoliath,
  fighterClass: fcProspect,
  cost: 35,
});
const fpBruiser = buildFighterPrototype({
  name: "Bruiser",
  faction: factionGoliath,
  fighterClass: fcGanger,
  cost: 55,
});
const fpBully = buildFighterPrototype({
  name: "Bully",
  faction: factionGoliath,
  fighterClass: fcJuve,
  cost: 35,
});

export const fighterPrototypes = [
  fpForgeTyrant,
  fpForgeBoss,
  fpStimmer,
  fpForgeBorm,
  fpBruiser,
  fpBully,
];

const fighters = [
  buildFighter({ fighterPrototype: fpForgeBoss }),
  buildFighter({ fighterPrototype: fpBruiser }),
  buildFighter({ fighterPrototype: fpBruiser }),
];

export const gang = buildGang({ faction: factionGoliath });

export const gangDetail = buildGangDetail({ ...gang, fighters });
