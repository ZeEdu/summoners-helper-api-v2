import { SummonerSpellDataDragon } from '../ddragon/dto/spell.dto';

const summonerSpellsJSON: SummonerSpellDataDragon = require(
  `../../assets/ddragon/summoner.json`,
);

export const SUMMONER_SPELL_MAP_ID = Object.values(
  summonerSpellsJSON.data,
).reduce((previousValue, currentValue) => {
  return {
    ...previousValue,
    ...{
      [currentValue.key]: currentValue.id,
      [currentValue.id]: currentValue.key,
    },
  };
}, {});
