import { RunesReforgedDataDragon } from '../ddragon/dto/runes-reforged-data.dragon';

const runesJSON: RunesReforgedDataDragon[] = require(
  `../../assets/ddragon/runesReforged.json`,
);

const flatRunes = runesJSON
  .map((rune) => rune.slots.map((slot) => slot.runes.map((rune) => rune)))
  .flat(2);

export const RUNE_SLOTS = flatRunes.reduce(
  (previousValue, currentValue) => ({
    ...previousValue,
    [currentValue.id]: currentValue,
  }),
  {},
);

export const RUNE_SLOTS_MAP = flatRunes.reduce(
  (previousValue, currentValue) => {
    return {
      ...previousValue,
      [currentValue.id]: currentValue.key,
      [currentValue.key]: currentValue.id,
    };
  },
  {},
);

export const MAIN_RUNES = runesJSON.reduce(
  (previousValue, currentValue) => ({
    ...previousValue,
    [currentValue.id]: currentValue,
  }),
  {},
);

export const MAIN_RUNES_MAP = runesJSON.reduce(
  (previousValue, currentValue) => {
    return {
      ...previousValue,
      ...{
        [currentValue.id]: currentValue.key,
        [currentValue.key]: currentValue.id,
      },
    };
  },
  {},
);
