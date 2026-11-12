import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserDto } from "@org/contracts";
import { Observable } from "rxjs";
import { AuthenticatedRequest } from "../../../types";
import { CommentsService } from "../../service/comments.service";

@Injectable()
export class IsCreatorOrAdmin implements CanActivate {
  constructor(private commentsService: CommentsService) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user as UserDto
    const commentId = request.params['commentId'] as string

    if (user.isSystemAdmin) return true
    return this.commentsService.checkCreatedComment(commentId, user.id)
  }
}