import { Component, inject, Input } from "@angular/core";
import { DataDragonService } from './../../../../data-dragon/data-dragon.service';

import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { PopulatedGuideDto } from "@org/contracts";
import { RuneSlot } from "./rune-slot/rune-slot";

@Component({
  selector: 'app-runes',
  templateUrl: './runes.html',
  styleUrl: './runes.scss',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, RuneSlot]
})
export class Runes {
  @Input() guide: PopulatedGuideDto

  dataDragonService = inject(DataDragonService)

  get mainRuneName() {
    return this.dataDragonService.rune(this.guide.primaryRune)?.name
  }

  get secondaryRuneName() {
    return this.dataDragonService.rune(this.guide.secondaryRune)?.name
  }
}