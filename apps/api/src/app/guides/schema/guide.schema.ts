import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { IGuide, IRuneSlots } from '@org/contracts';

import { AbilitiesProgression, AbilitiesProgressionSchema } from './abilities-progression.schema';
import { Items, ItemSchema } from './item.schema';
import { RuneSlots } from './rune-slot.schema';
import { Threat, ThreatSchema } from './threat.schema';

@Schema()
export class Guide implements IGuide {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  introduction: string;

  @Prop({ type: String, required: true })
  champion: string;

  @Prop({ type: String, required: true })
  role: string;

  @Prop({ type: String, required: true })
  patchVersion: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: String, required: true })
  primaryRune: string;

  @Prop({ type: String, required: true })
  primaryRuneDescription: string;

  @Prop({ type: RuneSlots, required: true })
  primarySlots: IRuneSlots;

  @Prop({ type: String, required: true })
  secondaryRune: string;

  @Prop({ type: String, required: true })
  secondaryRuneDescription: string;

  @Prop({ type: RuneSlots, required: true })
  secondarySlots: IRuneSlots;

  @Prop({ type: String, required: true })
  bonusSlotOne: string;

  @Prop({ type: String, required: true })
  bonusSlotTwo: string;

  @Prop({ type: String, required: true })
  bonusSlotThree: string;

  @Prop({ type: String, required: true })
  bonusDescription: string;

  // Spells
  @Prop({ type: String, required: true })
  firstSpell: string;

  @Prop({ type: String, required: true })
  secondSpell: string;

  @Prop({ type: String, required: true })
  spellsDescription: string;

  // Abilities Progression
  @Prop({ type: String, required: true })
  abilitiesProgressionDescription: string;

  @Prop({ type: AbilitiesProgressionSchema }) // TODO Garantir que isso funciona
  abilitiesProgression: AbilitiesProgression;

  // Items
  @Prop({ type: String, required: true })
  itemsDescription: string;

  @Prop([{ type: ItemSchema }])
  itemsBlock: Items[];

  // Threats
  @Prop({ type: String, required: true })
  threatsDescription: string;

  @Prop([{ type: ThreatSchema }])
  threats: Threat[];
}

export const GuideSchema = SchemaFactory.createForClass(Guide);

export type GuideDocument = HydratedDocument<Guide>

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
