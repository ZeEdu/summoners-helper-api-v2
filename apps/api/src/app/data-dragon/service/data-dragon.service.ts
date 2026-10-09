import { Injectable } from '@nestjs/common';
import { ChampionsDataDragon } from '../../ddragon/dto/champion.dto';
import { ItemsDataDragon } from '../../ddragon/dto/item.dto';
import { RunesReforgedDataDragon } from '../../ddragon/dto/runes-reforged-data.dragon';
import { SummonerSpell, SummonerSpellDataDragon } from '../../ddragon/dto/spell.dto';

import { ChampionDataDragon, RunesReforgedSlots } from '@org/contracts';

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

@Injectable()
export class DataDragonService {
  async getPatchVersion(): Promise<{ patch: string }> {
    const url = 'https://ddragon.leagueoflegends.com/api/versions.json'
    const versions = await fetch(url)
      .then(data => data.json())
    const patch = versions[0]

    return { patch }
  }

  async getAssets() {
    const { patch } = await this.getPatchVersion()

    const champions = await this.champions(patch)
    const runes = await this.runes(patch)
    const runeSlots = this.runesSlots(runes.list)
    const spells = await this.spells(patch)
    const items = await this.items(patch)

    return {
      data: {
        lists: {
          champions: champions.list,
          runes: runes.list,
          runeSlots: runeSlots.list,
          spells: spells.list,
          items: items.list
        },
        maps: {
          champions: champions.map,
          runes: runes.map,
          runeSlots: runeSlots.map,
          spells: spells.map,
          items: items.map
        }
      },
      version: patch
    }
  }

  async champion(championId: string, patchVersion?: string) {
    let patch = patchVersion
    if (!patch) {
      const getPatch = await this.getPatchVersion()
      patch = getPatch.patch
    }

    const url = buildUrl(ENDPOINTS.champion(championId), patch);
    const init: RequestInit = { method: 'GET' };

    return fetch(url, init).then(response => response.json()).then((response: ChampionDataDragon) => response)
  }

  private async champions(patchVersion: string) {
    const url = buildUrl(ENDPOINTS.champions, patchVersion);
    const init: RequestInit = { method: 'GET' };

    const json = await fetch(url, init).then(response => response.json()).then((response: ChampionsDataDragon) => response)
    const list = Object.values(json.data)
    const map = json.data

    return { list, map }
  }

  private async spells(patchVersion: string) {
    const url = buildUrl(ENDPOINTS.spells, patchVersion);
    const init: RequestInit = { method: 'GET' };

    const json = await fetch(url, init).then(response => response.json()).then((response: SummonerSpellDataDragon) => response)

    const list = Object.values(json.data)
      .filter((spell) => spell.modes.includes('CLASSIC'))
    const map = list.reduce((previousValue, currentValue) => {
      return { ...previousValue, [currentValue.id]: currentValue }
    }, {} as Record<string, SummonerSpell>)

    return { list, map }
  }

  private async runes(patchVersion: string) {
    const url = buildUrl(ENDPOINTS.runes, patchVersion);
    const init: RequestInit = { method: 'GET' };

    const json = await fetch(url, init).then(response => response.json()).then((response: RunesReforgedDataDragon[]) => response)

    const map = json
      .reduce(
        (previousValue: Record<string, RunesReforgedDataDragon>, currentValue: RunesReforgedDataDragon) =>
          ({ ...previousValue, [currentValue.id.toString()]: currentValue }), {} as Record<string, RunesReforgedDataDragon>
      )

    return { list: json, map }
  }

  private runesSlots(runes: RunesReforgedDataDragon[]) {
    const list = runes
      .reduce(
        (previousValue, currentValue) => [...previousValue, ...currentValue.slots.map(slot => slot.runes).flat()]
        , [] as RunesReforgedSlots[])

    const map = list.reduce((previousValue, currentValue) => {
      return { ...previousValue, [currentValue.id.toString()]: currentValue }
    }, {} as Record<string, RunesReforgedSlots>)

    return { list, map }
  }


  private async items(patchVersion: string) {
    const url = buildUrl(ENDPOINTS.items, patchVersion);
    const init: RequestInit = { method: 'GET' };

    const json = await fetch(url, init).then(response => response.json()).then((response: ItemsDataDragon) => response)

    const map = json.data
    const list = Object.keys(json.data).map((key) => ({ ...json.data[key], id: key }))
    return { list, map }
  }
}
