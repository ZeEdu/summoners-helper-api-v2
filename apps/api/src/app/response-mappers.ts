import { GuideDto, IGuide, IUser, PopulatedGuideDto, UserDto, UserDtoWithPassword, UserDtoWithPuuid } from "@org/contracts";
import { IUserWithPassword, IUserWithPuuid } from "./users/schema/user.schema";

function user(user: IUser): UserDto {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    password: user.password,
    refreshToken: user.refreshToken,
    gameName: user.gameName,
    tagLine: user.tagLine,
    server: user.server,
    puuid: user.puuid,
    isSystemAdmin: user.isSystemAdmin
  }
}

function userWithPassword(user: IUserWithPassword): UserDtoWithPassword {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    password: user.password,
    refreshToken: user.refreshToken,
    gameName: user.gameName,
    tagLine: user.tagLine,
    server: user.server,
    puuid: user.puuid,
    isSystemAdmin: user.isSystemAdmin
  }
}

function userWithPuuid(user: IUserWithPuuid): UserDtoWithPuuid {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    password: user.password,
    refreshToken: user.refreshToken,
    gameName: user.gameName,
    tagLine: user.tagLine,
    server: user.server,
    puuid: user.puuid,
    isSystemAdmin: user.isSystemAdmin
  }
}

function guide(guide: IGuide): GuideDto {
  return {
    ...guide,
    createdBy: guide.createdBy.toString(),
    id: guide._id.toString()
  }
}

function populatedGuide(guide: IGuide): PopulatedGuideDto {
  return {
    ...guide,
    id: guide._id.toString(),
    createdBy: user(guide.createdBy as IUser)
  }
}

const ResponseMappers = {
  user,
  userWithPassword,
  userWithPuuid,
  guide,
  populatedGuide
};

export default ResponseMappers
