import { Types } from 'mongoose';
import { AbilityOption } from '../enums';

export interface IItemList {
  itemId: string
}

export interface IItems {
  rowName: string;
  items: IItemList[];
  description: string;
}

export interface IRuneSlots {
  first: string;
  second: string;
  third: string;
  fourth?: string;
}

export interface IAbilitiesProgression {
  l1: AbilityOption;
  l2: AbilityOption;
  l3: AbilityOption;
  l4: AbilityOption;
  l5: AbilityOption;
  l6: AbilityOption;
  l7: AbilityOption;
  l8: AbilityOption;
  l9: AbilityOption;
  l10: AbilityOption;
  l11: AbilityOption;
  l12: AbilityOption;
  l13: AbilityOption;
  l14: AbilityOption;
  l15: AbilityOption;
  l16: AbilityOption;
  l17: AbilityOption;
  l18: AbilityOption;
}

export interface IThreat {
  threat: string;
  description: string;
}

export interface IGuide {
  // Intro
  _id: Types.ObjectId;
  // _id: string;

  title: string;
  createdBy: Types.ObjectId;
  // createdBy: string;

  introduction: string;
  patchVersion: string;

  createdAt: Date;
  updatedAt?: Date;
  champion: string;
  role: string;

  // Runes
  primaryRune: string;
  primaryRuneDescription: string;
  primarySlots: IRuneSlots;

  secondaryRune: string;
  secondaryRuneDescription: string;
  secondarySlots: IRuneSlots;

  // Bonus
  bonusSlotOne: string;
  bonusSlotTwo: string;
  bonusSlotThree: string;
  bonusDescription: string;

  // Spells
  firstSpell: string;
  secondSpell: string;

  spellsDescription: string;

  // Items
  items: IItems[];
  itemsDescription: string;

  // Abilities Progression
  abilitiesProgression: IAbilitiesProgression;
  abilitiesProgressionDescription: string;

  threatsDescription: string;
  threats: IThreat[];
}