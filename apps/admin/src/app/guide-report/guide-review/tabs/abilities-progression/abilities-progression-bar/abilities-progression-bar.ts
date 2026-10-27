import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";

import { AbilityOption, ChampionDataDragonSpell, ChampionsDataDragonDetailsSolo, getAbilityOption, PopulatedGuideDto } from "@org/contracts";

import { DataDragonService } from "../../../../../data-dragon/data-dragon.service";

function getKeyToPressFromAbilityOptions(value: AbilityOption) {
  switch (value) {
    case AbilityOption.D:
      return 'r'
    case AbilityOption.C:
      return 'e'
    case AbilityOption.B:
      return 'w'
    case AbilityOption.A:
    default:
      return 'q'
  }
}

type ProgressionType = {
  key: "q" | "w" | "e" | "r",
  spell: ChampionDataDragonSpell
}

@Component({
  selector: 'app-abilities-progression-bar',
  templateUrl: './abilities-progression-bar.html',
  styleUrl: './abilities-progression-bar.scss',
  imports: [CommonModule, MatCard, MatCardContent]
})
export class AbilitiesProgressionBar implements OnInit {
  @Input() guide: PopulatedGuideDto
  @Input() champion: ChampionsDataDragonDetailsSolo

  dataDragonService = inject(DataDragonService)

  progressionPerLevel: ProgressionType[]

  ngOnInit(): void {
    const spells: Record<string, ChampionDataDragonSpell> = this.champion.spells
      .reduce((previous, current) => ({
        ...previous, [current.id]: current
      }), {}
      )

    this.progressionPerLevel = Object.values(this.guide.abilitiesProgression)
      .map(getAbilityOption)
      .filter(v => !!v)
      .map(abilityOption => getKeyToPressFromAbilityOptions(abilityOption))
      .map((key) => ({
        key, spell: spells[`${this.championId}${key.toUpperCase()}`]
      }))
  }

  get championId() {
    return this.champion.id
  }

  spellURL(spell: ChampionDataDragonSpell) {
    return `https://ddragon.leagueoflegends.com/cdn/${this.dataDragonService.patch()}/img/spell/${spell.id}.png`
  }
}