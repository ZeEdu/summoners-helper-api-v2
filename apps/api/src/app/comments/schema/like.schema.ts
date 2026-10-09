import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";

export interface ICommentLike {
  _id: Types.ObjectId;
  comment: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
}

@Schema()
export class CommentLike implements ICommentLike {
  _id: Types.ObjectId

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Comment', required: true })
  comment: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Date, required: true })
  createdAt: Date;
}

const commentLikeSchema = SchemaFactory.createForClass(CommentLike)
commentLikeSchema.index({ user: 1, comment: 1 }, { unique: true })
export const CommentLikeSchema = commentLikeSchema

export type CommentLikeDocument = HydratedDocument<CommentLike>