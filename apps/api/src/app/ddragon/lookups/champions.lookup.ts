import { ChampionsDataDragon } from '../dto/champion.dto';

const championsJSON: ChampionsDataDragon = require(
  `../../../assets/ddragon/championFull.json`,
);

const CHAMPIONS_MAP: { [key: string]: string } = Object.entries(
  championsJSON.keys,
).reduce((previousValue, champion) => {
  const [key, value] = champion;
  return {
    ...previousValue,
    ...{ [key]: value, [value as string]: key },
  };
}, {});

function getChampionById(championId: number) {
  const result = CHAMPIONS_MAP[championId];
  if (!result) {
    throw new Error(`Invalid champ id ${championId}`);
  }

  return championsJSON.data[result];
}

export const ChampionsLookup = {
  getChampionById,
};
