import { Component, Input } from "@angular/core";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";

import { PopulatedGuideDto } from "@org/contracts";

import { ItemSection } from "./item-section/item-section";

@Component({
  selector: 'app-items',
  templateUrl: './items.html',
  styleUrl: './items.scss',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, ItemSection]
})
export class Items {
  @Input() guide: PopulatedGuideDto
}