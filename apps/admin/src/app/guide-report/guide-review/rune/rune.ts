import { Component, inject, Input, OnInit } from "@angular/core";

import { DomSanitizer } from "@angular/platform-browser";
import { RunesReforgedDataDragon } from "@org/contracts";
import { DataDragonService } from "../../../data-dragon/data-dragon.service";

@Component({
  selector: 'app-rune',
  templateUrl: './rune.html',
  styleUrl: './rune.scss'
})
export class Rune implements OnInit {
  @Input({ required: true }) title: string
  @Input({ required: true }) runeId: string

  dataDragonService = inject(DataDragonService)
  domSanitizer = inject(DomSanitizer)

  rune: RunesReforgedDataDragon | undefined

  ngOnInit(): void {
    this.rune = this.dataDragonService.rune(this.runeId)
  }

  get name() {
    return this.rune?.name || ''
  }

  get thumbnail() {
    return `https://ddragon.leagueoflegends.com/cdn/img/${this.rune?.icon}`
  }
}