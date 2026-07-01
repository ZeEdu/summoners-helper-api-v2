import { RunesReforgedDataDragon } from '../dto/runes-reforged-data.dragon';

const runesJSON: RunesReforgedDataDragon[] = require(
  `../../../assets/ddragon/runesReforged.json`,
);

const flatRunes = runesJSON
  .map((rune) => rune.slots.map((slot) => slot.runes.map((rune) => rune)))
  .flat(2);

const RUNE_SLOTS = flatRunes.reduce(
  (previousValue, currentValue) => ({
    ...previousValue,
    [currentValue.id]: currentValue,
  }),
  {},
);

const MAIN_RUNES = runesJSON.reduce(
  (previousValue, currentValue) => ({
    ...previousValue,
    [currentValue.id]: currentValue,
  }),
  {},
);

function getMainRuneById(runeId: number) {
  return MAIN_RUNES[runeId];
}
function getRuneSlotById(runeSlotId: number) {
  return RUNE_SLOTS[runeSlotId];
}

export const RunesLookup = { getMainRuneById, getRuneSlotById };
