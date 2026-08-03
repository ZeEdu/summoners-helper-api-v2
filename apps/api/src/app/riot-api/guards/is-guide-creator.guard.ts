import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Guide } from '../../guides/schema/guide.schema';
import { Model } from 'mongoose';
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

    return this.guideModel
      .findOne({
        _id: guideId,
        createdBy: _id,
      })
      .then((guide) => !!guide);
  }
}
