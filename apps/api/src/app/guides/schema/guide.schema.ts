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
  threats: IThreat[];
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

  @Prop({ type: RunesSchema })
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

  @Prop([{ type: ItemSchema }])
  itemsBlock: Items[];

  @Prop({ type: String })
  itemsDescription: string;

  @Prop({ type: AbilitiesProgressionSchema }) // TODO Garantir que isso funciona
  abilitiesProgression: AbilitiesProgression;

  @Prop({ type: String })
  abilitiesProgressionDescription: string;

  @Prop([{ type: ThreatSchema }])
  threats: Threat[]; // TODO Garantir que isso funciona

  @Prop({ type: String })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  _id: Types.ObjectId;
}

// Criar schemas proprios para os documentos internos do schema como spells, runes, items, etc.

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
