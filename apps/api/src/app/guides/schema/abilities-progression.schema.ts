import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum AbilityOption {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
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

@Schema()
export class AbilitiesProgression implements IAbilitiesProgression {
  @Prop({ type: String, enum: AbilityOption, required: true })
  l1: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l2: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l3: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l4: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l5: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l6: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l7: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l8: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l9: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l10: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l11: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l12: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l13: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l14: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l15: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l16: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l17: AbilityOption;

  @Prop({ type: String, enum: AbilityOption, required: true })
  l18: AbilityOption;
}

export const AbilitiesProgressionSchema = SchemaFactory.createForClass(AbilitiesProgression)