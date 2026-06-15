import { IUser } from '../schema/user.schema';
import { UsersService } from '../service/users.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  createUserPaginationFilter,
  UserPaginationDto,
} from '../user.pagination.dto';
import { JwtGuard } from '../../guards/jwt.guard';

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
    return this.usersService.getAllUsers(filter, pagination);
  }
}
