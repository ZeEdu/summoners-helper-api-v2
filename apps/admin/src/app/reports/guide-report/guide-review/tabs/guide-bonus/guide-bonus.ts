import { Component, Input } from "@angular/core";

import { PopulatedGuideDto } from "@org/contracts";

import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { Bonus } from "./bonus/bonus";

@Component({
  selector: 'app-guide-bonus',
  templateUrl: './guide-bonus.html',
  styleUrl: './guide-bonus.scss',
  imports: [Bonus, MatCard, MatCardTitle, MatCardHeader, MatCardContent]
})
export class GuideBonus {
  @Input({ required: true }) guide: PopulatedGuideDto
}