import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { IItems, Items, ItemSchema } from './item.schema';
import { AbilitiesProgression, AbilitiesProgressionSchema } from './abilities-progression.schema';
import { IThreat, Threat, ThreatSchema } from './threat.schema';
import { IRunes, Runes, RunesSchema } from './rune.schema';

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
  runes: IRunes;
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
  itemsBlock: IItems[];
  itemsDescription: string;

  // Abilities Progression
  abilitiesProgression: AbilitiesProgression;
  abilitiesProgressionDescription: string;

  threatsDescription: string;
  threats: IThreat[];
}

@Schema()
export class Guide implements IGuide {
  @Prop({ type: String, required: true })
  introduction: string;

  @Prop({ type: String, required: true })
  patchVersion: string;

  @Prop({ type: Date })
  createdAt: Date;
  @Prop({ type: Date })
  updatedAt?: Date;

  @Prop({ type: String, required: true })
  champion: string;

  @Prop({ type: String, required: true })
  role: string;

  @Prop({ type: String, required: true })
  bonusSlotOne: string;

  @Prop({ type: String, required: true })
  bonusSlotTwo: string;

  @Prop({ type: String, required: true })
  bonusSlotThree: string;

  @Prop({ type: String, required: true })
  bonusDescription: string;

  @Prop({ type: String, required: true })
  firstSpell: string;
  @Prop({ type: String, required: true })
  secondSpell: string;
  @Prop({ type: String, required: true })
  spellsDescription: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: String, required: true })
  abilitiesProgressionDescription: string;

  @Prop({ type: AbilitiesProgressionSchema }) // TODO Garantir que isso funciona
  abilitiesProgression: AbilitiesProgression;

  @Prop({ type: String, required: true })
  itemsDescription: string;

  @Prop([{ type: ItemSchema }])
  itemsBlock: Items[];

  @Prop({ type: String, required: true })
  threatsDescription: string;

  @Prop([{ type: ThreatSchema }])
  threats: Threat[]; // TODO Garantir que isso funciona

  @Prop({ type: String, required: true })
  runesDescription: string;

  @Prop({ type: RunesSchema })
  runes: Runes;

  _id: Types.ObjectId;
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
