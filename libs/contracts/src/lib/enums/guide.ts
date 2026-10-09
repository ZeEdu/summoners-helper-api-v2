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

export enum SLOT_BONUS_LABELS {
  ADAPTIVE_FORCE = 'Força Adaptativa',
  ADAPTIVE_FORCE_SCALING = 'Força Adaptativa por nível',
  ARMOR = 'Armadura',
  ATTACK_SPEED = 'Velocidade de Ataque',
  CDR_SCALING = 'Aceleração de Habilidade por nível',
  HEALTH = 'Vida',
  HEALTH_SCALING = 'Vida por nível',
  HASTE = 'Aceleração de Habilidade',
  MOVEMENT_SPEED = 'Velocidade de Movimento',
  TENACITY = 'Tenacidade',
}

function isBonus(value: string): value is keyof typeof SLOT_BONUS {
  return value in SLOT_BONUS;
}

function isBonusLabel(value: string): value is keyof typeof SLOT_BONUS_LABELS {
  return value in SLOT_BONUS_LABELS;
}

export function getBonus(key: string): SLOT_BONUS | undefined {
  if (isBonus(key)) {
    return SLOT_BONUS[key]
  }

  return undefined
}

export function getBonusLabel(key: string): SLOT_BONUS_LABELS | undefined {
  const bonus = getBonus(key)
  if (!bonus) return undefined

  if (isBonusLabel(bonus)) {
    return SLOT_BONUS_LABELS[bonus]
  }

  return undefined
}