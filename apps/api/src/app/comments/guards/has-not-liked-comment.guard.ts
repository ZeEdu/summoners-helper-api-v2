import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthenticatedRequest } from "../../types";
import { CommentsService } from "../service/comments.service";

@Injectable()
export class HasNotLikedCommentGuard implements CanActivate {
  constructor(private commentsService: CommentsService) { }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const { user } = request
    const commentId = request.params['commentId']

    return this.commentsService
      .likedComment(commentId.toString(), user.id)
      .then((like) => like === null)
  }
}