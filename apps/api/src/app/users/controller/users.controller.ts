import { IUser } from '../schema/user.schema';
import { UsersService } from '../service/users.service';
import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import {
  createUserPaginationFilter,
  UserPaginationDto,
} from '../user.pagination.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { CurrentUser } from '../../decorators/user.decorator';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers(@Query() pagination: UserPaginationDto): Promise<{
    count: number;
    users: IUser[];
  }> {
    const filter = createUserPaginationFilter(pagination);
    const { offset, limit } = pagination;
    return this.usersService.getAllUsers(filter, { offset, limit });
  }

  @Patch('update-profile')
  async updateProfile(
    @CurrentUser() user: IUser,
    @Body() updateProfileDto: UpdateUserProfileDto,
  ) {
    await this.usersService.updateUserWithRiotData(user, updateProfileDto);
  }
}
