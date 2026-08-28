import { createContext } from "react";
import { ChampionsDataDragonDetails } from "../../dtos/champion.dto";
import { ItemDetails } from "../../dtos/item.dto";
import { RunesReforgedDataDragon } from "../../dtos/runes-reforged.dto";
import { SummonerSpell } from "../../dtos/spell.dto";

export interface ItemDetailsWithId extends ItemDetails {
  id: string
}

export type DataDragon = {
  champions: ChampionsDataDragonDetails[],
  spells: SummonerSpell[],
  runes: RunesReforgedDataDragon[],
  items: ItemDetailsWithId[]
}

export type DataDragonMaps = {
  champions: Record<string, ChampionsDataDragonDetails>
  spells: Record<string, SummonerSpell>,
  runes: Record<string, RunesReforgedDataDragon>,
  items: Record<string, ItemDetails>,
}

export type DataDragonContextType = {
  loading: boolean;
  error: string | undefined;
  dataDragon: DataDragon;
  dataDragonMaps: DataDragonMaps;

  reload: () => void

  getChampion: (id: string) => ChampionsDataDragonDetails
  getSpell: (id: string) => SummonerSpell
  getRune: (id: string) => RunesReforgedDataDragon
  getItem: (id: string) => ItemDetails

}

export const DataDragonContext = createContext<DataDragonContextType | undefined>(undefined)