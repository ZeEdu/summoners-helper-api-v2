import { Component, Input } from "@angular/core";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { PopulatedGuideDto } from "@org/contracts";
import { Threat } from "./threat/threat";

@Component({
  selector: 'app-threats',
  templateUrl: './threats.html',
  styleUrl: './threats.scss',
  imports: [Threat, MatCard, MatCardHeader, MatCardTitle, MatCardContent]
})
export class Threats {
  @Input() guide: PopulatedGuideDto
}