import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { Guide } from '../../guides/schema/guide.schema';
import { IUserWithPuuid } from '../../users/schema/user.schema';

@Injectable()
export class IsGuideCreatorGuard implements CanActivate {
  constructor(@InjectModel(Guide.name) private guideModel: Model<Guide>) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { guideId } = request.params;
    const { _id } = request.user as IUserWithPuuid;
    const filter = {
      _id: guideId,
      createdBy: _id,
    };

    return this.guideModel.findOne(filter).then((guide) => !!guide);
  }
}
