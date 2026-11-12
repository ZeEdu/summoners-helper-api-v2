export enum ROLES {
  JUNGLE = 'JUNGLE',
  TOP_LANE = 'TOP_LANE',
  MID_LANE = 'MID_LANE',
  ADC = 'ADC',
  SUPPORT = 'SUPPORT'
}

export enum ROLES_LABEL {
  JUNGLE = 'Jungle',
  TOP_LANE = 'Top Lane',
  MID_LANE = 'Mid Lane',
  ADC = 'ADC',
  SUPPORT = 'Support'
}

function isRolesTypeGuard(key: string): key is ROLES {
  return Object.values(ROLES).includes(key as ROLES)
}

function isRolesLabelTypeGuard(key: string): key is ROLES_LABEL {
  return Object.keys(ROLES_LABEL).includes(key as ROLES_LABEL)
}

export function getRoleLabel(value: string) {
  if (isRolesTypeGuard(value) && isRolesLabelTypeGuard(value)) {
    return ROLES_LABEL[value]
  }

  return ''
}

export enum AbilityOption {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
}

export function isAbilityOption(value: string): value is AbilityOption {
  return ['a', 'b', 'c', 'd'].includes(value)
}

export function getAbilityOption(value: string): AbilityOption | null {
  if (isAbilityOption(value)) {
    return value
  }
  return null
}

export enum SLOT_BONUS {
  ADAPTIVE_FORCE = 'AdaptiveForce',
  ADAPTIVE_FORCE_SCALING = 'AdaptiveForceScaling',
  ARMOR = 'Armor',
  ATTACK_SPEED = 'AttackSpeed',
  CDR_SCALING = 'CDRScaling',
  HEALTH = 'HealthPlus',
  HEALTH_SCALING = 'HealthScaling',
  HASTE = 'MagicRes',
  MOVEMENT_SPEED = 'MovementSpeed',
  TENACITY = 'Tenacity',

  AdaptiveForce = 'ADAPTIVE_FORCE',
  AdaptiveForceScaling = 'ADAPTIVE_FORCE_SCALING',
  Armor = 'ARMOR',
  AttackSpeed = 'ATTACK_SPEED',
  CDRScaling = 'CDR_SCALING',
  HealthPlus = 'HEALTH',
  HealthScaling = 'HEALTH_SCALING',
  MagicRes = 'HASTE',
  MovementSpeed = 'MOVEMENT_SPEED',
  Tenacity = 'TENACITY',
}

function isBonus(value: string): value is keyof typeof SLOT_BONUS {
  return value in SLOT_BONUS;
}

export function getBonus(key: string): SLOT_BONUS | undefined {
  if (isBonus(key)) {
    return SLOT_BONUS[key]
  }

  return undefined
}

export const bonusValues: Record<string, number> = {
  ADAPTIVE_FORCE: 9,
  ADAPTIVE_FORCE_SCALING: 0,
  ARMOR: 6,
  ATTACK_SPEED: 10,
  CDR_SCALING: 8,
  HEALTH: 65,
  HEALTH_SCALING: 10,
  HASTE: 8,
  MOVEMENT_SPEED: 2.5,
  TENACITY: 10,
};

export function getBonusValue(bonus: string): number {
  const bonusSlot = getBonus(bonus)
  return bonusValues[bonusSlot as string];
}