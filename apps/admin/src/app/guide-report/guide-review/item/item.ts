import { OverlayModule } from "@angular/cdk/overlay";
import { Component, inject, Input, OnInit, SecurityContext, signal } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

import { ItemDetails } from "@org/contracts";

import { DataDragonService } from "../../../data-dragon/data-dragon.service";
import { GuideReviewUtils } from "../guide-review.utils";

@Component({
  selector: 'app-item',
  templateUrl: './item.html',
  styleUrl: './item.scss',
  imports: [
    OverlayModule,
  ]
})
export class Item implements OnInit {
  @Input({ required: true }) itemId: string

  showTooltip = signal(false)

  dataDragonService = inject(DataDragonService)
  domSanitizer = inject(DomSanitizer)

  item: ItemDetails | undefined

  ngOnInit(): void {
    this.item = this.dataDragonService.item(this.itemId)
  }

  get imageURL() {
    const itemImage = this.item?.image.full
    return `https://ddragon.leagueoflegends.com/cdn/${this.dataDragonService.patch()}/img/item/${itemImage}`
  }

  get name() {
    return this.item?.name || ''
  }

  get description() {
    if (this.item?.description) {
      const clean = this.domSanitizer.sanitize(SecurityContext.HTML, this.item.description)
      if (clean) {
        return GuideReviewUtils.cleanDOMElements(clean)
      }
    }

    return ''
  }

  onHover() {
    this.showTooltip.update((current) => !current)
  }
}
