import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuidesModule } from '../guides/guides.module';
import { CommentsController } from './controller/comments.controller';
import { Comment, CommentSchema } from './schema/comment.schema';
import { CommentLike, CommentLikeSchema } from './schema/like.schema';
import { CommentsService } from './service/comments.service';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: CommentLike.name, schema: CommentLikeSchema }]),
    GuidesModule
  ]
})
export class CommentsModule { }
