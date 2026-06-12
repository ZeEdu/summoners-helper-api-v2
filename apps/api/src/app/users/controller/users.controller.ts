import { JwtGuard } from '../../guards/jwt.guard';
import { PaginationDto } from '../../pagination/pagination.dto';
import { IUser } from '../schema/user.schema';
import { UsersService } from './../service/users.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers(@Query() pagination: PaginationDto): Promise<{
    count: number;
    users: IUser[];
  }> {
    return this.usersService.getAllUsers({}, pagination);
  }
}
