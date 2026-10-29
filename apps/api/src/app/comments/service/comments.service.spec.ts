import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Comment, CommentSchema } from '../schema/comment.schema';
import { CommentLike, CommentLikeSchema } from '../schema/like.schema';
import { CommentsService } from './comments.service';

describe('CommentsService', () => {
  let service: CommentsService;

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
      imports: [
        MongooseModule.forRoot(mongodb.getUri()),
        MongooseModule.forFeature([
          { name: Comment.name, schema: CommentSchema },
          { name: CommentLike.name, schema: CommentLikeSchema },
        ]),
      ]
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();



  });
});
