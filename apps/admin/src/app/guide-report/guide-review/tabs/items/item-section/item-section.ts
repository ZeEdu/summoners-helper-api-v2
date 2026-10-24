import { Component, Input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";

import { IItems } from "@org/contracts";

import { Item } from "./item/item";

@Component({
  selector: 'app-item-section',
  templateUrl: './item-section.html',
  styleUrl: './item-section.scss',
  imports: [MatCardModule, Item]
})
export class ItemSection {
  @Input() itemRow: IItems
}