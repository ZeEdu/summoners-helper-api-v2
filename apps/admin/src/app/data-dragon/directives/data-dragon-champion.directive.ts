import { afterNextRender, Directive, ElementRef, inject, Renderer2 } from "@angular/core";
import { interval, Subject, takeUntil } from "rxjs";
import { API_CONSTANTS } from "../../endpoint.constants";
import { DataDragonService } from "../data-dragon.service";


const DATA_DRAGON_ENDPOINT = 'data-dragon'
const ENDPOINT = `${API_CONSTANTS.API_URL}/${DATA_DRAGON_ENDPOINT}`

@Directive({
  selector: '[appChampionName]'
})
export class ChampionNameDirective {
  private dataDragonService = inject(DataDragonService)

  private readonly element: ElementRef<HTMLParagraphElement | HTMLSpanElement> = inject(ElementRef<HTMLParagraphElement | HTMLSpanElement>);
  private readonly renderer = inject(Renderer2)

  private loadedValue = new Subject<void>()

  constructor(
  ) {
    afterNextRender(() => {
      this.startLoop()
      const championId = this.element.nativeElement.innerText
      if (championId && typeof championId === 'string') {
        this.dataDragonService
          .champion(championId)
          .subscribe((champion) => {
            this.loadedValue.next()

            const textContent = champion?.name || championId
            this.renderer.setProperty(
              this.element.nativeElement,
              'textContent',
              textContent
            )
          })
      }
    })
  }


  startLoop() {
    let dotCount = 1

    interval(150)
      .pipe(takeUntil(this.loadedValue))
      .subscribe(() => {
        const traillingDots = Array.from({ length: dotCount }).map(() => '.').join('')

        dotCount = (dotCount < 4) ? (dotCount + 1) : 1

        this.renderer.setProperty(
          this.element.nativeElement,
          'textContent',
          traillingDots
        )
      })
  }
}