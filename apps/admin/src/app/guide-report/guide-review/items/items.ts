import { Component, Input } from "@angular/core";

import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { PopulatedGuideDto } from "@org/contracts";
import { ItemSection } from "../item-section/item-section";
import { Item } from "../item/item";

@Component({
  selector: 'app-items',
  templateUrl: './items.html',
  styleUrl: './items.scss',
  imports: [Item, MatDivider, MatCard, MatCardHeader, MatCardTitle, MatCardContent, ItemSection]
})
export class Items {
  @Input() guide: PopulatedGuideDto
}