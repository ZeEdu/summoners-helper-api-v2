import { Component, inject, Input, OnInit } from "@angular/core";

import { SummonerSpell } from "@org/contracts";

import { DataDragonService } from "../../../data-dragon/data-dragon.service";

@Component({
  selector: 'app-spell',
  templateUrl: './spell.html',
  styleUrl: './spell.scss'
})
export class Spell implements OnInit {
  @Input({ required: true }) title: string
  @Input({ required: true }) spellId: string

  dataDragonService = inject(DataDragonService)

  spell: SummonerSpell | undefined

  ngOnInit(): void {
    this.spell = this.dataDragonService.spell(this.spellId)
  }

  get name() {
    return this.spell?.name || ''
  }

  get thumbnail() {
    return `https://ddragon.leagueoflegends.com/cdn/${this.dataDragonService.patch()}/img/spell/${this.spell?.image.full}`
  }

  get description() {
    return this.spell?.description || ''
  }
} 