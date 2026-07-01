import { SummonerSpellDataDragon } from '../dto/spell.dto';

const summonerSpellsJSON: SummonerSpellDataDragon = require(
  `../../../assets/ddragon/summoner.json`,
);

const SUMMONER_SPELL_MAP = Object.values(summonerSpellsJSON.data).reduce(
  (previousValue, currentValue) => {
    return {
      ...previousValue,
      ...{
        [currentValue.key]: currentValue.id,
        [currentValue.id]: currentValue.key,
      },
    };
  },
  {},
);

function getSummonerSpellById(spellId: number) {
  const spellFromMap = SUMMONER_SPELL_MAP[spellId];
  return summonerSpellsJSON.data[spellFromMap];
}

export const SummonersSpellLookup = {
  getSummonerSpellById,
};
