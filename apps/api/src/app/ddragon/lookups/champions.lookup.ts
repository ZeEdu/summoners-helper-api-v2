import { ChampionsDataDragon } from '../dto/champion.dto';

const championsJSON: ChampionsDataDragon = require(
  `../../../assets/ddragon/championFull.json`,
);

const CHAMPIONS_MAP: { [key: string]: string } = Object.values(
  championsJSON.data,
).reduce((previousValue, champion) => {
  const { key, id } = champion;
  return {
    ...previousValue,
    ...{ [key]: id, [id]: key },
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
