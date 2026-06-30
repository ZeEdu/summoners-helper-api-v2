import { ChampionsDataDragon } from '../ddragon/dto/champion.dto';

const championsJSON: ChampionsDataDragon = require(
  `../../assets/ddragon/championFull.json`,
);

const CHAMPION_ID_MAP: { [key: string]: string } = Object.entries(
  championsJSON.keys,
).reduce((previousValue, currentValue) => {
  const [key, value] = currentValue;
  return {
    ...previousValue,
    ...{ [key]: value, [value as string]: key },
  };
}, {});

function getChampionById(championId: number) {
  const result = CHAMPION_ID_MAP[championId];
  if (!result) {
    throw new Error(`Invalid champ id ${championId}`);
  }
  return result;
}

function getChampionName(championId: number) {
  const name = getChampionById(championId);
  switch (name) {
    case 'Reksai':
      return 'RekSai';
    case 'JarvanIv':
      return 'JarvanIV';
  }
  return name;
}

export const CHAMPIONS = {
  getChampionName,
};
