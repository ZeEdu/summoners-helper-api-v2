
import { ExecutionContext } from '@nestjs/common';

import { CommentsService } from '../../service/comments.service';
import { IsCreatorOrAdmin } from './is-creator-or-admin.guard';

describe('IsCreatorOrAdmin', () => {
  let guard: IsCreatorOrAdmin;
  let commentsService: jest.Mocked<CommentsService>;

  const request = {
    params: { commentId: 'comment-123' },
    user: { id: 'user-123' },
  };

  const systemAdminRequest = {
    params: { commentId: 'comment-123' },
    user: { id: 'user-123', isSystemAdmin: true },
  }

  const createContext = (request: Record<string, any>) => {
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;
  }

  beforeEach(() => {
    commentsService = {
      checkCreatedComment: jest.fn(),
    } as unknown as jest.Mocked<CommentsService>;

    guard = new IsCreatorOrAdmin(commentsService);
  });

  it('should allow system admin to remove', async () => {
    commentsService.checkCreatedComment.mockResolvedValue(true);

    const context = createContext(systemAdminRequest)
    // Como apenas checa o valor no contexto passado, não precisa das funções assincronas
    expect(guard.canActivate(context)).toBe(true);
  })

  it('should allow creator to remove', async () => {
    commentsService.checkCreatedComment.mockResolvedValue(true);

    const context = createContext(request)
    await expect(guard.canActivate(context)).resolves.toBe(true);

    expect(commentsService.checkCreatedComment).toHaveBeenCalledWith(
      'comment-123',
      'user-123',
    );
  })

  it('should deny when user is not ssytem admin or creator', async () => {
    commentsService.checkCreatedComment.mockResolvedValue(false);

    const context = createContext(request)
    await expect(guard.canActivate(context)).resolves.toBe(false);

    expect(commentsService.checkCreatedComment).toHaveBeenCalledWith(
      'comment-123',
      'user-123',
    );
  })

  it('should propagate service errors', async () => {
    commentsService.checkCreatedComment.mockRejectedValue(
      new Error('Database error'),
    );

    const context = createContext(request)
    await expect(guard.canActivate(context)).rejects.toThrow(
      'Database error',
    );
  });
});
