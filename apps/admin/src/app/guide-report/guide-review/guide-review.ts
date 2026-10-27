import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { CommonModule } from "@angular/common";
import { MatIcon } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { GUIDE_REPORT_ACTION_TAKEN, GUIDE_REPORT_STATUS, IPopulatedGuideReportDto } from '@org/contracts';
import { DataDragonService } from "../../data-dragon/data-dragon.service";
import { Overview } from "./overview/overview";
import { AbilitiesProgression } from "./tabs/abilities-progression/abilities-progression";
import { GuideBonus } from "./tabs/guide-bonus/guide-bonus";
import { Introduction } from "./tabs/introduction/introduction";
import { Items } from "./tabs/items/items";
import { Runes } from "./tabs/runes/runes";
import { Spells } from "./tabs/spells/spells";
import { Threats } from "./threats/threats";

export enum GUIDE_REVIEW_ACTIONS {
  UNDO = 'UNDO',
  ARCHIVE = 'ARCHIVE',
  ACCEPT = 'ACCEPT'
}

@Component({
  selector: 'app-guide-review',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIcon,
    MatTabsModule,
    MatListModule,
    GuideBonus,
    Threats,
    Items,
    Introduction,
    Overview,
    Spells,
    Runes,
    AbilitiesProgression
  ],
  templateUrl: './guide-review.html',
  styleUrl: './guide-review.scss'
})
export class GuideReview {
  guideReport = inject<IPopulatedGuideReportDto>(MAT_DIALOG_DATA)

  dataDragonService = inject(DataDragonService)

  dialogRef = inject(MatDialogRef)

  GUIDE_REPORT_ACTION_TAKEN = GUIDE_REPORT_ACTION_TAKEN;
  GUIDE_REPORT_STATUS = GUIDE_REPORT_STATUS;

  championSpells = Array.from({ length: 4 })

  items = this.dataDragonService

  getRuneThumbnail(rune: string) {
    const selectedRune = this.dataDragonService.rune(rune)
    return `https://ddragon.leagueoflegends.com/cdn/img/${selectedRune?.icon}`
  }

  getRuneSlot(runeSlot: string) {
    return this.dataDragonService.runesSlot(runeSlot)
  }

  getRuneSlotThumbnail(runeSlot: string) {
    const selectedRunesSlot = this.dataDragonService.runesSlot(runeSlot)
    return `https://ddragon.leagueoflegends.com/cdn/img/${selectedRunesSlot?.icon}`
  }

  getItem(item: string) {
    return this.dataDragonService.item(item)
  }

  getSpellDescription(spell: string) {
    const selectedSpell = this.dataDragonService.spell(spell)
    return selectedSpell?.description
  }

  undoReport() {
    this.dialogRef.close(GUIDE_REVIEW_ACTIONS.UNDO)
  }
  archiveReport() {
    this.dialogRef.close(GUIDE_REVIEW_ACTIONS.ARCHIVE)
  }
  acceptReport() {
    this.dialogRef.close(GUIDE_REVIEW_ACTIONS.ACCEPT)
  }
}