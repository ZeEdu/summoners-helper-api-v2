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
  const bonus = getBonus(key);
  if (!bonus) return undefined;

  if (isBonusLabel(bonus)) {
    return SLOT_BONUS_LABELS[bonus];
  }

  return undefined;
}

export const bonusDescriptions: Record<string, { pt: string; en: string }> = {
  ADAPTIVE_FORCE: {
    pt: 'Aumenta o dano de ataque ou o poder de habilidade.',
    en: 'Increases attack damage or ability power.',
  },
  ADAPTIVE_FORCE_SCALING: {
    pt: 'Aumenta a força adaptativa por nível.',
    en: 'Increases adaptive force per level.',
  },
  ARMOR: {
    pt: 'Reduz o dano físico recebido.',
    en: 'Reduces physical damage taken.',
  },
  ATTACK_SPEED: {
    pt: 'Aumenta a velocidade de ataque.',
    en: 'Increases attack speed.',
  },
  CDR_SCALING: {
    pt: 'Reduz o tempo de recarga das habilidades.',
    en: 'Reduces ability cooldowns.',
  },
  HEALTH: {
    pt: 'Aumenta a vida máxima.',
    en: 'Increases maximum health.',
  },
  HEALTH_SCALING: {
    pt: 'Aumenta a vida por nível.',
    en: 'Increases health per level.',
  },
  HASTE: {
    pt: 'Permite usar habilidades com mais frequência.',
    en: 'Allows more frequent ability casts.',
  },
  MOVEMENT_SPEED: {
    pt: 'Aumenta a velocidade de movimento.',
    en: 'Increases movement speed.',
  },
  TENACITY: {
    pt: 'Reduz a duração dos efeitos de controle.',
    en: 'Reduces crowd control duration.',
  },
} as const;


export function getBonusDescription(bonus: string): string {
  const bonusSlot = getBonus(bonus);
  return bonusDescriptions[bonusSlot as string].pt;
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

export const bonusLabelsShard: Record<string, { pt: string; en: string }> = {
  ADAPTIVE_FORCE: {
    pt: 'DANO / PODER',
    en: 'DAMAGE / POWER',
  },
  ADAPTIVE_FORCE_SCALING: {
    pt: 'DANO / PODER',
    en: 'DAMAGE / POWER',
  },
  ARMOR: {
    pt: 'ARMADURA',
    en: 'ARMOR',
  },
  ATTACK_SPEED: {
    pt: 'VEL. ATAQUE',
    en: 'ATTACK SPD.',
  },
  CDR_SCALING: {
    pt: 'ACEL. HAB.',
    en: 'ABILITY HASTE',
  },
  HEALTH: {
    pt: 'VIDA',
    en: 'HEALTH',
  },
  HEALTH_SCALING: {
    pt: 'VIDA',
    en: 'HEALTH',
  },
  HASTE: {
    pt: 'ACEL. HAB.',
    en: 'ABILITY HASTE',
  },
  MOVEMENT_SPEED: {
    pt: 'VEL. MOV.',
    en: 'MOVE SPEED',
  },
  TENACITY: {
    pt: 'TENACIDADE',
    en: 'TENACITY',
  },
};

export function getBonusLabelsShard(bonus: string) {
  const bonusSlot = getBonus(bonus);
  return bonusLabelsShard[bonusSlot as string].pt;
}