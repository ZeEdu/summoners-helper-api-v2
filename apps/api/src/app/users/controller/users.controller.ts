import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { IUser, UpdateUserProfileDto, updateUserProfileSchema } from '@org/contracts';
import { CurrentUser } from '../../decorators/user.decorator';
import { JwtGuard } from '../../guards/jwt.guard';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { HasRiotInfoGuard } from '../../riot-api/guards/has-riot-info.guard';
import { IUserWithPuuid } from '../schema/user.schema';
import { UsersService } from '../service/users.service';
import {
  createUserPaginationFilter,
  UserPaginationDto,
  userPaginationSchema,
} from '../user.pagination.dto';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get()
  async getAllUsers(
    @Query(new ZodValidationPipe(userPaginationSchema))
    pagination: UserPaginationDto,
  ): Promise<{
    count: number;
    users: IUser[];
  }> {
    const filter = createUserPaginationFilter(pagination);
    const { offset, limit } = pagination;
    return this.usersService.getAllUsers(filter, { offset, limit });
  }

  @Get('me')
  async getMe(@CurrentUser() user: IUser): Promise<IUserWithPuuid | null> {
    return this.usersService.findOneByIdWithPuuid(user._id.toString());
  }

  @Patch('update-profile')
  async updateProfile(
    @CurrentUser()
    user: IUser,
    @Body(new ZodValidationPipe(updateUserProfileSchema))
    updateProfileDto: UpdateUserProfileDto,
  ) {
    await this.usersService.updateUserWithRiotData(user, updateProfileDto);
    return {}
  }

  @Get('top-masteries')
  @UseGuards(HasRiotInfoGuard)
  async getTopMasteries(@CurrentUser() user: IUserWithPuuid) {
    return this.usersService.getTopMasteries(user, 5);
  }

  @Get('last-five-matches')
  @UseGuards(HasRiotInfoGuard)
  async getLastFiveMatches(@CurrentUser() user: IUserWithPuuid) {
    return this.usersService.getLastFiveMatches(user);
  }
}
