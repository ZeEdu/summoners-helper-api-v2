import { Component, Input } from "@angular/core";

import { getBonusLabel } from "@org/contracts";

@Component({
  selector: 'app-bonus',
  templateUrl: './bonus.html',
  styleUrl: './bonus.scss'
})
export class Bonus {
  @Input({ required: true }) title: string
  @Input({ required: true }) bonus: string

  get name() {
    return getBonusLabel(this.bonus) || ''
  }

  get thumbnail() {
    return `https://ddragon.leagueoflegends.com/cdn/img/perk-images/StatMods/StatMods${this.bonus}Icon.png`
  }
}