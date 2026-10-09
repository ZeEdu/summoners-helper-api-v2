import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { IComment } from "@org/contracts";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";

@Schema()
export class Comment implements IComment {
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Guide', required: true })
  guide: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Comment' })
  replyTo?: Types.ObjectId | undefined;

  @Prop({ type: String })
  content?: string;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Boolean, default: false })
  removed: boolean;

  @Prop({ type: Date })
  removedAt?: Date;

  @Prop({ type: Number, default: 0 })
  likeCount: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment)

export type CommentDocument = HydratedDocument<Comment>