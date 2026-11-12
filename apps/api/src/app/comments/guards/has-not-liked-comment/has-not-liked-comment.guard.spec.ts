
import { ExecutionContext } from '@nestjs/common';

import { CommentsService } from '../../service/comments.service';
import { HasNotLikedCommentGuard } from './has-not-liked-comment.guard';

describe('HasNotLikedCommentGuard', () => {
  let guard: HasNotLikedCommentGuard;
  let commentsService: jest.Mocked<CommentsService>;

  const request = {
    params: { commentId: 'comment-123' },
    user: { id: 'user-123' },
  };

  const context = {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;

  beforeEach(() => {
    commentsService = {
      likedComment: jest.fn(),
    } as unknown as jest.Mocked<CommentsService>;

    guard = new HasNotLikedCommentGuard(commentsService);
  });

  it('should deny when user has liked the comment', async () => {
    commentsService.likedComment.mockResolvedValue(true);

    await expect(guard.canActivate(context)).resolves.toBe(true);

    expect(commentsService.likedComment).toHaveBeenCalledWith(
      'comment-123',
      'user-123',
    );
  });

  it('should allow when user has not liked the comment', async () => {
    commentsService.likedComment.mockResolvedValue(false);

    await expect(guard.canActivate(context)).resolves.toBe(false);

    expect(commentsService.likedComment).toHaveBeenCalledWith(
      'comment-123',
      'user-123',
    )
  });

  it('should propagate service errors', async () => {
    commentsService.likedComment.mockRejectedValue(
      new Error('Database error'),
    );

    await expect(guard.canActivate(context)).rejects.toThrow(
      'Database error',
    );
  });
});
