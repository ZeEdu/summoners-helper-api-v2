import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { I18nModule } from 'nestjs-i18n';
import { GuidesModule } from '../../guides/guides.module';
import { I18N } from '../../i18n.config';
import { Comment, CommentSchema } from '../schema/comment.schema';
import { CommentLike, CommentLikeSchema } from '../schema/like.schema';
import { CommentsService } from '../service/comments.service';
import { CommentsController } from './comments.controller';


describe('CommentsController', () => {
  let controller: CommentsController;

  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
  });

  afterAll(async () => {
    await mongodb.stop();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentsService],
      controllers: [CommentsController],
      imports: [
        GuidesModule,
        MongooseModule.forRoot(mongodb.getUri()),
        MongooseModule.forFeature([
          { name: Comment.name, schema: CommentSchema },
          { name: CommentLike.name, schema: CommentLikeSchema },
        ]),
        I18nModule.forRoot(I18N.config)
      ]
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
