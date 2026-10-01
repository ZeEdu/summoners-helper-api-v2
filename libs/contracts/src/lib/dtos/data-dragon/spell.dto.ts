export interface SummonerSpellDataDragon {
  type: string;
  version: string;
  data: { [key: string]: SummonerSpell };
}

export interface SummonerSpell {
  id: string;
  name: string;
  description: string;
  tooltip: string;
  maxrank: number;
  cooldown: number[];
  cooldownBurn: string;
  cost: number[];
  costBurn: string;
  datavalues: any;
  effect: Array<number[] | null>;
  effectBurn: Array<null | string>;
  vars: Var[];
  key: string;
  summonerLevel: number;
  modes: string[];
  costType: CostType;
  maxammo: string;
  range: number[];
  rangeBurn: string;
  image: SpellImage;
  resource: Resource;
}

export enum CostType {
  S = 's',
  SICooldown = 's %i:cooldown%',
}

export interface SpellImage {
  full: string;
  sprite: SpellSprite;
  group: SpellGroup;
  x: number;
  y: number;
  w: number;
  h: number;
}

export enum SpellGroup {
  Spell = 'spell',
}

export enum SpellSprite {
  Spell0PNG = 'spell0.png',
}

export enum Resource {
  CooldownSICooldown = '{{ cooldown }}s %i:cooldown%',
  ICooldownModifiedcooldownS = '%i:cooldown% {{ modifiedcooldown }}s',
}

export interface Var {
  link: string;
  coeff: number[] | number;
  key: string;
}

// Module './item.dto' has already exported a member named 'Group'. Consider explicitly re-exporting to resolve the ambiguity.
// Module './item.dto' has already exported a member named 'Image'. Consider explicitly re-exporting to resolve the ambiguity.
// Module './item.dto' has already exported a member named 'Sprite'. Consider explicitly re-exporting to resolve the ambiguity.