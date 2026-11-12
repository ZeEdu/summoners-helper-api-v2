import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { commentPagination, CommentPaginationDto, CreateCommentDto, createCommentFormSchema, CreateCommentFormType, createCommentReplyFormSchema, CreateCommentReplyFormType, CreateCommentReplyType, UserDto } from '@org/contracts';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '../../../generated/i18n.generated';
import { CurrentUser } from '../../decorators/user.decorator';
import { JwtGuard } from '../../guards/jwt.guard';
import { GuidesService } from '../../guides/service/guides.service';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import CommentsFilters from '../comments.filters';
import { HasLikedCommentGuard } from '../guards/has-liked-comment/has-liked-comment.guard';
import { HasNotLikedCommentGuard } from '../guards/has-not-liked-comment/has-not-liked-comment.guard';
import { IsCreatorOrAdmin } from '../guards/is-creator-or-admin/is-creator-or-admin.guard';
import { CommentsService } from '../service/comments.service';

@Controller('comments')
@UseGuards(JwtGuard)
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private guidesService: GuidesService,
    private i18nService: I18nService<I18nTranslations>,
  ) { }

  @Get('')
  get(
    @CurrentUser() user: UserDto,
    @Query(new ZodValidationPipe(commentPagination))
    pagination: CommentPaginationDto
  ) {
    const { offset, limit, sort } = pagination
    const filter = CommentsFilters.get(pagination)

    // Passar o usuário 
    return this.commentsService.get(filter, { offset, limit, sort }, user.id)
  }

  @Post('')
  async post(
    @CurrentUser() user: UserDto,
    @Body(new ZodValidationPipe(createCommentFormSchema))
    body: CreateCommentFormType
  ) {
    const guideExists = await this.guidesService.getById(body.guide)
    if (!guideExists) {
      throw new BadRequestException(this.i18nService.t('comments.errors.post.guideDoNotExists'))
    }

    const comment: CreateCommentDto = {
      content: body.content,
      guide: body.guide,

      createdBy: user.id,
      createdAt: new Date().toISOString(),
    }

    return this.commentsService.post(comment)
  }

  @Post('reply')
  async replyTo(
    @CurrentUser() user: UserDto,
    @Body(new ZodValidationPipe(createCommentReplyFormSchema))
    body: CreateCommentReplyFormType
  ) {
    const originalNotRemoved = await this.commentsService.notRemoved(body.replyTo)
    if (!originalNotRemoved) {
      throw new BadRequestException(this.i18nService.t('comments.errors.reply.opRemoved'))
    }

    const guideExists = await this.guidesService.getById(body.guide)
    if (!guideExists) {
      throw new BadRequestException(this.i18nService.t('comments.errors.reply.guideDoNotExists'))
    }

    const reply: CreateCommentReplyType = {
      content: body.content,
      replyTo: body.replyTo,
      guide: body.guide,

      createdBy: user.id,
      createdAt: new Date().toISOString(),
    }

    return this.commentsService.post(reply)
  }

  @Post('like/:commentId')
  @UseGuards(HasNotLikedCommentGuard)
  async like(
    @CurrentUser() user: UserDto,
    @Param('commentId') commentId: string
  ) {
    return this.commentsService.like(commentId, user.id)
  }

  // checar se o usuário já tem um like do comentário antes
  @Post('unlike/:commentId')
  @UseGuards(HasLikedCommentGuard)
  async unlike(
    @CurrentUser() user: UserDto,
    @Param('commentId') commentId: string
  ) {
    return this.commentsService.unlike(commentId, user.id)
  }

  // Must creator or admin
  @Delete(':commentId')
  @UseGuards(IsCreatorOrAdmin)
  async remove(
    @Param('commentId')
    commentId: string
  ) {
    await this.commentsService.remove(commentId)
  }
}
