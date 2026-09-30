import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

type Lvls = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18
type LvlKey = `l${Lvls}`

const keymapIndex = {
  0: 'q',
  1: 'w',
  2: 'e',
  3: 'r',
};

type KeymapIndexType = keyof typeof keymapIndex;

const indexToAbilityOption = {
  0: AbilityOption.A,
  1: AbilityOption.B,
  2: AbilityOption.C,
  3: AbilityOption.D,
};

const CHAMPION_LEVELS = 18

const lvlsArrayBuilder = () => {
  return Array.from({ length: CHAMPION_LEVELS }, (_, i) => i + 1) as Array<Lvls>
}

import { CommonModule, JsonPipe, NgStyle } from "@angular/common";
import { MatIcon } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { AbilityOption, GUIDE_REPORT_ACTION_TAKEN, GUIDE_REPORT_STATUS, IPopulatedGuideReportDto, PopulatedGuideDto } from '@org/contracts';

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
    JsonPipe,
    NgStyle
  ],
  templateUrl: './guide-review.html',
  styleUrl: './guide-review.scss'
})
export class GuideReview {
  guideReport = inject<IPopulatedGuideReportDto>(MAT_DIALOG_DATA)

  dialogRef = inject(MatDialogRef)

  GUIDE_REPORT_ACTION_TAKEN = GUIDE_REPORT_ACTION_TAKEN;
  GUIDE_REPORT_STATUS = GUIDE_REPORT_STATUS;

  championSpells = Array.from({ length: 4 })

  levelsArray = lvlsArrayBuilder()

  getArrayLvl(lvl: Lvls): LvlKey {
    return `l${lvl}`
  }

  isSelected(guide: PopulatedGuideDto, lvl: Lvls, index: number) {
    const level = this.getArrayLvl(lvl)
    const selectedAbility = guide.abilitiesProgression[level]
    const value = indexToAbilityOption[index as KeymapIndexType]

    return selectedAbility === value
  }

  undoReport(guideReport: IPopulatedGuideReportDto) {
    this.dialogRef.close(GUIDE_REVIEW_ACTIONS.UNDO)
  }
  archiveReport(guideReport: IPopulatedGuideReportDto) {
    this.dialogRef.close(GUIDE_REVIEW_ACTIONS.ARCHIVE)
  }
  acceptReport(guideReport: IPopulatedGuideReportDto) {
    this.dialogRef.close(GUIDE_REVIEW_ACTIONS.ACCEPT)
  }
}