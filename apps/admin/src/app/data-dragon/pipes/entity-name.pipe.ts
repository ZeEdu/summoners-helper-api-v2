import { inject, Pipe, PipeTransform } from "@angular/core";
import { DataDragonService } from "../data-dragon.service";

type DataDragonEntity = 'champions' |
  'spells' |
  'runes' |
  'runesSlots' |
  'items'

@Pipe({
  name: 'entityName'
})
export class EntityName implements PipeTransform {
  private readonly dataDragonService = inject(DataDragonService)

  transform(id: string, entity: DataDragonEntity) {
    const maps = this.dataDragonService.maps()
    const selectedMap = maps?.[entity]
    const selectedItem = selectedMap?.[id]
    const name = selectedItem?.name
    return name
  }
}