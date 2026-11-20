import { Component, Input } from '@angular/core'
import { getSlotBonusLabelFromString } from '../../../../../../data-dragon/pipes/bonus-name.pipe'

@Component({
  selector: 'app-bonus',
  templateUrl: './bonus.html',
  styleUrl: './bonus.scss',
})
export class Bonus {
  @Input({ required: true }) bonus: string

  get name() {
    return getSlotBonusLabelFromString(this.bonus) || ''
  }

  get thumbnail() {
    return `https://ddragon.leagueoflegends.com/cdn/img/perk-images/StatMods/StatMods${this.bonus}Icon.png`
  }
}
