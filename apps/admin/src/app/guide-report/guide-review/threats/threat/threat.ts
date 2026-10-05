import { Component, inject, Input } from "@angular/core";

import { IThreat } from "@org/contracts";

import { DataDragonService } from "../../../../data-dragon/data-dragon.service";
import { EntityName } from "../../../../data-dragon/pipes/entity-name.pipe";


@Component({
  selector: 'app-threat',
  templateUrl: './threat.html',
  styleUrl: './threat.scss',
  imports: [EntityName]
})
export class Threat {
  @Input() threat: IThreat

  dataDragonService = inject(DataDragonService)

  get thumbnail() {
    return `https://ddragon.leagueoflegends.com/cdn/${this.dataDragonService.patch()}/img/champion/${this.threat.threat}.png`
  }
}