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
  @Prop({ type: String, enum: AbilityOption })
  l1: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l2: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l3: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l4: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l5: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l6: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l7: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l8: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l9: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l10: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l11: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l12: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l13: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l14: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l15: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l16: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l17: AbilityOption;

  @Prop({ type: String, enum: AbilityOption })
  l18: AbilityOption;
}

export const AbilitiesProgressionSchema = SchemaFactory.createForClass(AbilitiesProgression)