import { Component, Input } from "@angular/core";

import { MatDivider } from "@angular/material/divider";
import { PopulatedGuideDto } from "@org/contracts";
import { Item } from "../item/item";

@Component({
  selector: 'app-items',
  templateUrl: './items.html',
  styleUrl: './items.scss',
  imports: [Item, MatDivider]
})
export class Items {
  @Input() guide: PopulatedGuideDto
}