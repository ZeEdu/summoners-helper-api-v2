import { Component, inject, Input } from "@angular/core";

import { MatCard, MatCardContent, MatCardModule } from "@angular/material/card";
import { PopulatedGuideDto } from "@org/contracts";

import { MatDivider } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { DataDragonService } from "../../../data-dragon/data-dragon.service";
import { EntityName } from "../../../data-dragon/pipes/entity-name.pipe";
import { RoleName } from "../../../data-dragon/pipes/role-name.pipe";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
  imports: [MatCardModule, EntityName, RoleName, MatIconModule, MatCard,
    MatCardContent, MatDivider]
})

export class Overview {
  @Input() guide: PopulatedGuideDto

  dataDragonService = inject(DataDragonService)

  get titleSeparator() {
    return String.fromCharCode(0xb7)
  }

  get createdAt() {
    return new Date(this.guide.createdAt).toLocaleString('pt-BR')
  }

  get championThumbnail() {
    return `https://ddragon.leagueoflegends.com/cdn/${this.dataDragonService.patch()}/img/champion/${this.guide.champion}.png`;
  }
}