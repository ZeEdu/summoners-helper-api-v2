
import { ChampionDataDragon, ChampionsDataDragon } from "../../dtos/champion.dto";
import { ItemsDataDragon } from "../../dtos/item.dto";
import { RunesReforgedDataDragon } from "../../dtos/runes-reforged.dto";
import { SummonerSpellDataDragon } from "../../dtos/spell.dto";
import { customFetch } from '../../utils/customFetch/customFetch';

const BASE_URL = `https://ddragon.leagueoflegends.com/cdn`
const LANGUAGE = 'pt_BR'

const ENDPOINTS = {
  champions: 'champion',
  champion: (champion: string) => {
    return `champion/${champion}`
  },
  spells: 'summoner',
  runes: 'runesReforged',
  items: 'item',
}

const buildUrl = (endpoint: string, patchVersion: string) => {
  return `${BASE_URL}/${patchVersion}/data/${LANGUAGE}/${endpoint}.json`;
}

export const DataDragon = {
  champions: async (patchVersion: string) => {
    const url = buildUrl(ENDPOINTS.champions, patchVersion);
    const init: RequestInit = { method: 'GET' };

    return customFetch<ChampionsDataDragon>(url, init)
  },
  champion: async (champion: string, patchVersion: string) => {
    const url = buildUrl(ENDPOINTS.champion(champion), patchVersion);
    const init: RequestInit = { method: 'GET' };

    return customFetch<ChampionDataDragon>(url, init)
  },
  spells: async (patchVersion: string) => {
    const url = buildUrl(ENDPOINTS.spells, patchVersion);
    const init: RequestInit = { method: 'GET' };

    return customFetch<SummonerSpellDataDragon>(url, init)
  },
  runes: async (patchVersion: string) => {
    const url = buildUrl(ENDPOINTS.runes, patchVersion);
    const init: RequestInit = { method: 'GET' };

    return customFetch<RunesReforgedDataDragon[]>(url, init)
  },
  items: async (patchVersion: string) => {
    const url = buildUrl(ENDPOINTS.items, patchVersion);
    const init: RequestInit = { method: 'GET' };

    return customFetch<ItemsDataDragon>(url, init)
  }
};