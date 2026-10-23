import { Component, Input } from "@angular/core";

import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { PopulatedGuideDto } from "@org/contracts";
import { Spell } from "../../spell/spell";

@Component({
  selector: 'app-spells',
  templateUrl: './spells.html',
  styleUrl: './spells.scss',
  imports: [Spell, MatCard, MatCardHeader, MatCardContent, MatCardTitle]
})
export class Spells {
  @Input() guide: PopulatedGuideDto
}