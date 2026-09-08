import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { AbilityOption, IAbilitiesProgression } from '@org/contracts';

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