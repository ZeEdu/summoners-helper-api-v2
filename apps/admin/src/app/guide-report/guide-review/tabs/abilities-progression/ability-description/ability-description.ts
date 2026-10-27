import { Component, inject, Input } from "@angular/core";

import { MatCardModule } from "@angular/material/card";
import { ChampionDataDragonSpell } from "@org/contracts";
import { DataDragonService } from "../../../../../data-dragon/data-dragon.service";

const keymapIndex = {
  0: 'q',
  1: 'w',
  2: 'e',
  3: 'r',
};

type KeymapIndexType = keyof typeof keymapIndex;

function isValidIndex(index: number): index is KeymapIndexType {
  return [0, 1, 2, 3].includes(index)
}

@Component({
  selector: 'app-ability-description',
  templateUrl: './ability-description.html',
  styleUrl: './ability-description.scss',
  imports: [MatCardModule]
})
export class AbilityDescription {
  @Input() spell: ChampionDataDragonSpell
  @Input() index: number

  dataDragonService = inject(DataDragonService)

  get thumbnailUrl() {
    return `https://ddragon.leagueoflegends.com/cdn/${this.dataDragonService.patch()}/img/spell/${this.spell.id}.png`
  }

  get key() {
    if (isValidIndex(this.index)) {
      return keymapIndex[this.index].toUpperCase()
    }

    return ''
  }
}