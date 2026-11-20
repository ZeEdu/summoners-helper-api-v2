import { Pipe, PipeTransform } from '@angular/core'
import { SLOT_BONUS } from '@org/contracts'

enum SLOT_BONUS_LABELS {
  AdaptiveForce = 'Força Adaptativa',
  AdaptiveForceScaling = 'Força Adaptativa por nível',
  Armor = 'Armadura',
  AttackSpeed = 'Velocidade de Ataque',
  CDRScaling = 'Aceleração de Habilidade por nível',
  HealthPlus = 'Vida',
  HealthScaling = 'Vida por nível',
  MagicRes = 'Aceleração de Habilidade',
  MovementSpeed = 'Velocidade de Movimento',
  Tenacity = 'Tenacidade',
}

function isSlotBonus(value: string): value is keyof typeof SLOT_BONUS {
  return value in SLOT_BONUS
}

function isSlotLabelBonus(value: string): value is keyof typeof SLOT_BONUS_LABELS {
  return value in SLOT_BONUS_LABELS
}

export function getSlotBonusLabel(label: SLOT_BONUS) {
  if (isSlotLabelBonus(label)) {
    return SLOT_BONUS_LABELS[label]
  }
  return null
}

export function getSlotBonusLabelFromString(value: string) {
  if (isSlotBonus(value)) {
    const label = SLOT_BONUS[value]
    return getSlotBonusLabel(label)
  }

  return value
}

@Pipe({
  name: 'bonusName',
})
export class BonusName implements PipeTransform {
  transform(value: string) {
    return getSlotBonusLabelFromString(value)
  }
}
