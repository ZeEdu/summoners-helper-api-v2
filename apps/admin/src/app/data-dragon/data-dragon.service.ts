import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { ChampionDataDragon, ChampionsDataDragonDetails, ChampionsDataDragonDetailsSolo, ItemDetails, RunesReforgedDataDragon, RunesReforgedSlots, SummonerSpell } from "@org/contracts";
import { map, Observable, of, tap } from "rxjs";
import { API_CONSTANTS } from "../endpoint.constants";

const DATA_DRAGON_ENDPOINT = 'data-dragon'
const ENDPOINT = `${API_CONSTANTS.API_URL}/${DATA_DRAGON_ENDPOINT}`

export interface ItemDetailsWithId extends ItemDetails {
  id: string
}

export type DataDragonLists = {
  champions: ChampionsDataDragonDetails[],
  spells: SummonerSpell[],
  runes: RunesReforgedDataDragon[],
  runesSlots: RunesReforgedSlots[],
  items: ItemDetailsWithId[]
}

export type DataDragonMaps = {
  champions: Record<string, ChampionsDataDragonDetails>
  spells: Record<string, SummonerSpell>,
  runes: Record<string, RunesReforgedDataDragon>,
  runesSlots: Record<string, RunesReforgedSlots>,
  items: Record<string, ItemDetails>,
}

type AssetsResponse = {
  data: {
    lists: DataDragonLists,
    maps: DataDragonMaps
  },
  version: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataDragonService {
  private readonly http = inject(HttpClient)

  private _patch = signal<string | undefined>(undefined)
  private _maps = signal<DataDragonMaps | undefined>(undefined)
  private _lists = signal<DataDragonLists | undefined>(undefined)

  private _fullChampions = signal<Record<string, ChampionsDataDragonDetailsSolo> | undefined>(undefined)

  readonly patch = this._patch.asReadonly()
  readonly maps = this._maps.asReadonly()
  readonly lists = this._lists.asReadonly()

  private readonly fullChampions = this._fullChampions.asReadonly()

  load() {
    return this.http
      .get<AssetsResponse>(`${ENDPOINT}/assets`)
      .pipe(
        tap(({ data, version }) => {
          this._maps.set(data.maps)
          this._lists.set(data.lists)
          this._patch.set(version)
        })
      )
  }

  champion(champion: string): Observable<ChampionsDataDragonDetailsSolo | undefined> {
    if (!this.maps()?.champions[champion]) {
      return of(undefined)
    }

    const cachedChampion = this.fullChampions()?.[champion]
    if (cachedChampion) {
      return of(cachedChampion)
    }

    return this.http
      .get<ChampionDataDragon>(`${ENDPOINT}/champion/${champion}`)
      .pipe(
        tap((response) => {
          this._fullChampions
            .update((current) => ({ ...current, champion: response.data[champion] }))
        }),
        map((response) => response.data[champion])
      )
  }

  item(item: string): ItemDetails | undefined {
    return this.maps()?.items?.[item]
  }

  rune(rune: string): RunesReforgedDataDragon | undefined {
    return this.maps()?.runes?.[rune]
  }

  runesSlot(runeSlot: string): RunesReforgedSlots | undefined {
    return this.maps()?.runesSlots?.[runeSlot]
  }

  spell(spell: string): SummonerSpell | undefined {
    return this.maps()?.spells?.[spell]
  }
}