import { Pipe, PipeTransform } from "@angular/core";
import { SLOT_BONUS, SLOT_BONUS_LABELS } from "@org/contracts";

function isSlotBonus(value: string): value is keyof typeof SLOT_BONUS {
  return value in SLOT_BONUS;
}

function isSlotLabelBonus(value: string): value is keyof typeof SLOT_BONUS_LABELS {
  return value in SLOT_BONUS_LABELS;
}

@Pipe({
  name: 'bonusName'
})
export class BonusName implements PipeTransform {
  transform(value: string) {
    if (isSlotBonus(value)) {
      const label = SLOT_BONUS[value]
      if (isSlotLabelBonus(label)) {
        return SLOT_BONUS_LABELS[label]
      }
    }

    return value
  }
}