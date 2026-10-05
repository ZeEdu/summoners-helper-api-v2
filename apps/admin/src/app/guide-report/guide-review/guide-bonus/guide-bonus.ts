import { Component, Input } from "@angular/core";

import { PopulatedGuideDto } from "@org/contracts";

import { Bonus } from "./bonus/bonus";

@Component({
  selector: 'app-guide-bonus',
  templateUrl: './guide-bonus.html',
  styleUrl: './guide-bonus.scss',
  imports: [Bonus]
})
export class GuideBonus {
  @Input({ required: true }) guide: PopulatedGuideDto
}