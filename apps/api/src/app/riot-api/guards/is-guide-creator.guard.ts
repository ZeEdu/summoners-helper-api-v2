import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';

import { Guide } from '../../guides/schema/guide.schema';
import { AuthenticatedRequest } from '../../types';

@Injectable()
export class IsGuideCreatorGuard implements CanActivate {
  constructor(@InjectModel(Guide.name) private guideModel: Model<Guide>) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const { guideId } = request.params;
    const { id } = request.user
    const filter = {
      _id: guideId,
      createdBy: id,
    };

    return this.guideModel.findOne(filter).then((guide) => !!guide);
  }
}
