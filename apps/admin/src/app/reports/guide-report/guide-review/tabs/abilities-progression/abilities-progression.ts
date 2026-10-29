import { AsyncPipe, CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { Observable } from "rxjs";

import { ChampionsDataDragonDetailsSolo, PopulatedGuideDto } from "@org/contracts";

import { AbilitiesProgressionBar } from "./abilities-progression-bar/abilities-progression-bar";
import { AbilityDescription } from "./ability-description/ability-description";
import { DataDragonService } from "../../../../../data-dragon/data-dragon.service";

@Component({
  selector: 'app-abilities-progression',
  templateUrl: './abilities-progression.html',
  styleUrl: './abilities-progression.scss',
  imports: [AsyncPipe, CommonModule, MatCard, MatCardHeader, MatCardTitle, MatCardContent, AbilityDescription, AbilitiesProgressionBar]
})
export class AbilitiesProgression implements OnInit {
  @Input() guide: PopulatedGuideDto

  dataDragonService = inject(DataDragonService)

  fullChampion: Observable<ChampionsDataDragonDetailsSolo | undefined>

  ngOnInit(): void {
    this.fullChampion = this.dataDragonService.champion(this.guide.champion)
  }
}