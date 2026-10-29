
import { DataDragonLists, DataDragonMaps } from "../../contexts/data-dragon/data-dragon.context";
import { ChampionDataDragon } from "../../dtos/champion.dto";
import { customFetch } from '../../utils/customFetch/customFetch';
import { API_CONSTANTS } from "./api.constants";

type AssetsResponse = {
  data: {
    lists: DataDragonLists,
    maps: DataDragonMaps
  },
  version: string;
}

export const DataDragon = {
  champion: async (champion: string) => {
    const url = `${API_CONSTANTS.API_URL}/data-dragon/champion/${champion}`;
    const init: RequestInit = { method: 'GET' };

    return customFetch<ChampionDataDragon>(url, init)
  },

  assets: async () => {
    const url = `${API_CONSTANTS.API_URL}/data-dragon/assets`;

    const init: RequestInit = { method: 'GET' };
    return customFetch<AssetsResponse>(url, init)
  }
}