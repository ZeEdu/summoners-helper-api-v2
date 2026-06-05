import { Public } from '../../decorators/public.decorator';
import { JwtGuard } from '../../guards/jwt.guard';
import { PaginationDto } from '../../pagination/pagination.dto';
import { IUser } from '../schema/user.schema';
import { UsersService } from './../service/users.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';


@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get()
  @Public()
  async getAllUsers(@Query() pagination: PaginationDto): Promise<{
    count: number;
    users: IUser[];
  }> {
    const users = await this.usersService.getAllUsers(pagination)
    console.log({ users });
    return users
  }
}
