import { Component, inject, Input, OnInit, SecurityContext } from "@angular/core";

import { DomSanitizer } from "@angular/platform-browser";
import { RunesReforgedSlots } from "@org/contracts";
import { DataDragonService } from "../../../data-dragon/data-dragon.service";
import { GuideReviewUtils } from "../guide-review.utils";

@Component({
  selector: 'app-rune-slot',
  templateUrl: './rune-slot.html',
  styleUrl: './rune-slot.scss'
})
export class RuneSlot implements OnInit {
  @Input({ required: true }) title: string
  @Input({ required: true }) runeSlotId: string

  dataDragonService = inject(DataDragonService)
  domSanitizer = inject(DomSanitizer)

  runeSlot: RunesReforgedSlots | undefined

  ngOnInit(): void {
    this.runeSlot = this.dataDragonService.runesSlot(this.runeSlotId)
  }

  get name() {
    return this.runeSlot?.name || ''
  }

  get thumbnail() {
    return `https://ddragon.leagueoflegends.com/cdn/img/${this.runeSlot?.icon}`
  }

  get description() {
    const desc = this.runeSlot?.shortDesc
    if (desc) {
      const clean = this.domSanitizer.sanitize(SecurityContext.HTML, desc)
      if (clean) {
        return GuideReviewUtils.cleanDOMElements(clean)
      }
    }
    return desc || ''
  }
}