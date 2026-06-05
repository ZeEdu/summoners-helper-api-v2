import { BadRequestException, Injectable } from "@nestjs/common"
import { UsersService } from "../../users/service/users.service"
import * as bcrypt from 'bcrypt'
import { IUser } from "../../users/schema/user.schema"
import { CreateUserDto } from "../../users/dto/create-user.dto"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private jwtService: JwtService) { }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmailWithPassword(email)
    if (!user) {
      throw new BadRequestException('Usuário não encontrado')
    }

    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      throw new BadRequestException('Senha não está correta')
    }

    const { password: _pass, ...result } = user
    return result
  }

  async login(user: IUser): Promise<{ accessToken: string }> {
    const payload = { email: user.email, id: user._id }
    return { accessToken: this.jwtService.sign(payload) }
  }

  async register(user: CreateUserDto): Promise<{ accessToken: string }> {
    const userByEmail = await this.usersService.findOneByEmail(user.email)
    if (userByEmail) {
      throw new BadRequestException('Email já está sendo utilizado')
    }

    const userByUsername = await this.usersService.findOneByUsername(user.username)
    if (userByUsername) {
      throw new BadRequestException('Nome de usuário já está sendo utilizado')
    }

    const hashedPassword = await bcrypt.hash(user.password, 10)
    const createdUser = await this.usersService.create({ ...user, password: hashedPassword })
    return this.login(createdUser)
  }
}