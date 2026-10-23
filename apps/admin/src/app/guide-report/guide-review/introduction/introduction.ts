import { Component, Input } from "@angular/core";

import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { PopulatedGuideDto } from "@org/contracts";
import { EntityName } from "../../../data-dragon/pipes/entity-name.pipe";
import { RoleName } from "../../../data-dragon/pipes/role-name.pipe";

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.html',
  styleUrl: './introduction.scss',
  imports: [MatCard, MatCardHeader, MatCardContent, MatCardTitle, MatCardSubtitle, MatIcon, RoleName, EntityName]
})
export class Introduction {
  @Input() guide: PopulatedGuideDto
}