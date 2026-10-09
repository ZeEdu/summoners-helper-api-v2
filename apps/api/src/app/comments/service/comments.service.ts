import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';

import { CreateCommentDto, DEFAULT_LIMIT, DEFAULT_OFFSET, IComment, PaginationDto, sortBuilder } from '@org/contracts';

import ResponseMappers from '../../response-mappers';
import { Comment, CommentDocument } from '../schema/comment.schema';
import { CommentLike, CommentLikeDocument, ICommentLike } from '../schema/like.schema';

@Injectable()
export class CommentsService {

  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(CommentLike.name) private commentLikeModel: Model<CommentLikeDocument>
  ) { }

  async get(filter?: QueryFilter<Comment>, pagination?: PaginationDto, userId?: string) {
    const limit = pagination?.limit || DEFAULT_LIMIT
    const offset = pagination?.offset || DEFAULT_OFFSET
    const sort = sortBuilder(pagination?.sort)

    filter = filter || {}

    const count = await this.commentModel.countDocuments(filter)

    const skip = offset * limit

    const comments = await this.commentModel
      .find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .populate('createdBy')
      .lean<IComment[]>()

    let userLikes: ICommentLike[] = []
    if (userId) {
      userLikes = await this.commentLikeModel.find({
        comment: { $in: comments.map((c) => c._id) },
        user: userId
      }).lean()
    }

    if (userLikes.length > 0) {
      const likedComments = new Set(userLikes.map(l => l.comment._id.toString()))
      comments.forEach(c => {
        c.liked = likedComments.has(c._id.toString())
      })
    }

    return { comments: comments.map(ResponseMappers.comment), count }
  }

  async getById(commentId: string) {
    return this.commentModel.findById(commentId)
  }

  async notRemoved(commentId: string) {
    return this.commentModel.exists({ _id: commentId, removed: false })
  }

  async post(commentDto: CreateCommentDto) {
    const comment = await this.commentModel.create(commentDto)
    return ResponseMappers.comment(comment)
  }

  async remove(commentId: string) {
    const filter = { _id: commentId }
    const update: Partial<IComment> = {
      content: undefined,
      createdBy: undefined,
      removedAt: new Date()
    }
    await this.commentModel.updateOne(filter, update)
  }

  async like(commentId: string, userId: string) {

    await this.commentLikeModel.insertOne(
      {
        comment: commentId,
        user: userId,
        createdAt: new Date()
      }
    )

    await this.commentModel
      .updateOne(
        { _id: commentId },
        {
          $inc: { likeCount: 1 }
        }
      )

  }

  async unlike(commentId: string, userId: string) {
    await this.commentLikeModel.deleteOne(
      {
        comment: commentId,
        user: userId
      }
    )

    await this.commentModel
      .updateOne(
        { _id: commentId },
        {
          $inc: { likeCount: -1 }
        }
      )
  }

  async likedComment(commentId: string, userId: string) {
    return this.commentLikeModel.exists({ comment: commentId, user: userId })
  }
}
