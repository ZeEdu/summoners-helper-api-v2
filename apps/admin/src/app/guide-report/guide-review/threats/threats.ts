import { Component, Input } from "@angular/core";
import { PopulatedGuideDto } from "@org/contracts";
import { Threat } from "./threat/threat";

@Component({
  selector: 'app-threats',
  templateUrl: './threats.html',
  styleUrl: './threats.scss',
  imports: [Threat]
})
export class Threats {
  @Input() guide: PopulatedGuideDto
}