import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Items, ItemSchema } from './item.schema';

export interface IGuide {
  _id: Types.ObjectId;
  title: string;
  createdBy: Types.ObjectId;

  introduction: string;

  patchVersion: string;

  createdAt: Date;

  updatedAt?: Date;

  champion: string;

  role: string;

  // Runes
  runes: Runes;
  runesDescription: string;

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
  itemsBlock: Items[];
  itemsDescription: string;

  // Abilities Progression
  abilitiesProgression: AbilitiesProgression;
  abilitiesProgressionDescription: string;
  threats: Threat[];
}

@Schema()
export class Guide implements IGuide {
  @Prop({ type: String })
  introduction: string;

  @Prop({ type: String })
  patchVersion: string;

  @Prop({ type: Date })
  createdAt: Date;
  @Prop({ type: Date })
  updatedAt?: Date;

  @Prop({ type: String })
  champion: string;

  @Prop({ type: String })
  role: string;

  runes: Runes;

  @Prop({ type: String })
  runesDescription: string;

  @Prop({ type: String })
  bonusSlotOne: string;
  @Prop({ type: String })
  bonusSlotTwo: string;
  @Prop({ type: String })
  bonusSlotThree: string;

  @Prop({ type: String })
  bonusDescription: string;

  @Prop({ type: String })
  firstSpell: string;
  @Prop({ type: String })
  secondSpell: string;
  @Prop({ type: String })
  spellsDescription: string;

  @Prop([{ type: ItemSchema }]) // TODO Garantir que isso funciona
  itemsBlock: Items[];

  @Prop({ type: String })
  itemsDescription: string;

  abilitiesProgression: AbilitiesProgression;
  @Prop({ type: String })
  abilitiesProgressionDescription: string;

  threats: Threat[]; // TODO Garantir que isso funciona

  _id: Types.ObjectId;

  @Prop({ type: String })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

// Criar schemas proprios para os documentos internos do schema como spells, runes, items, etc.

export const GuideSchema = SchemaFactory.createForClass(Guide);

export const CAN_UPDATE_FIELDS = [
  'introduction',
  'patchVersion',
  'champion',
  'role',
  'runesDescription',
  'bonusSlotOne',
  'bonusSlotTwo',
  'bonusSlotThree',
  'bonusDescription',
  'firstSpell',
  'secondSpell',
  'spellsDescription',
  'itemsBlock',
  'itemsDescription',
  'abilitiesProgressionDescription',
  'title',
];

export interface Bonus {
  slotOne: BonusItem;
  slotTwo: BonusItem;
  slotThree: BonusItem;
}

export interface BonusItem {
  id: string;
  description: string;
}

export interface Spells {
  first: string;
  second: string;
}

export interface AbilitiesProgression {
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
export enum AbilityOption {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
}

export interface Runes {
  primaryRune: string;
  primarySlots: RuneSlots;
  secondaryRune: string;
  secondarySlots: RuneSlots;
}

export interface RuneSlots {
  first: string;
  second: string;
  third: string;
  fourth?: string;
}

export interface Threat {
  threat: string;
  description: string;
}
