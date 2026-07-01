import { ChampionsLookup } from './lookups/championsLookup';
import { RunesLookup } from './lookups/runes-reforged.lookup';
import { SummonersSpellLookup } from './lookups/summoner-spell.lookup';
import { ItemsLookup } from './lookups/itemsLookup';

export const DataDragonLookup = {
  getChampion: (championId: number) => {
    return ChampionsLookup.getChampionById(championId);
  },

  getItem: (itemId: number) => {
    return ItemsLookup.getItemById(itemId);
  },

  getRune: (runeId: number) => {
    return RunesLookup.getMainRuneById(runeId);
  },

  getRuneSlot: (runeSlotId: number) => {
    return RunesLookup.getRuneSlotById(runeSlotId);
  },

  getSummonerSpell: (spellId: number) => {
    return SummonersSpellLookup.getSummonerSpellById(spellId);
  },
};
