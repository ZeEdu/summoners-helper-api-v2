import { GuideDto, IComment, IGuide, IPopulatedGuideReport, IPopulatedGuideReportDto, ISerializedComment, IUser, PopulatedGuideDto, UserDto, UserDtoWithPassword, UserDtoWithPuuid } from "@org/contracts";
import { Types } from "mongoose";
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


function populatedGuideReport(guideReport: IPopulatedGuideReport): IPopulatedGuideReportDto {
  return {
    ...guideReport,
    id: guideReport._id.toString(),
    guide: populatedGuide(guideReport.guide),
    reportedBy: user(guideReport.reportedBy)
  }
}

function isUserDto(user: IUser | Types.ObjectId | UserDto): user is UserDto {
  return 'id' in user
}

function isPopulatedUser(user: IUser | Types.ObjectId | UserDto): user is IUser {
  return !('equals' in user) && ('_id' in user)
}

function isPopulatedGuide(guide: Types.ObjectId | IGuide): guide is IGuide {
  return !('equals' in guide)
}

function comment(comment: IComment): ISerializedComment {
  let commentCreatedBy: UserDto | undefined = undefined

  if (comment.createdBy && isPopulatedUser(comment.createdBy)) {
    commentCreatedBy = user(comment.createdBy)
  }

  let commentGuide: PopulatedGuideDto | undefined = undefined

  if (isPopulatedGuide(comment.guide)) {
    commentGuide = populatedGuide(comment.guide)
  }

  return {
    createdBy: (commentCreatedBy ?? comment.createdBy),
    guide: (commentGuide ?? comment.guide),
    id: comment._id.toString(),
    createdAt: comment.createdAt,
    removed: comment.removed,
    content: comment.content,
    replyTo: comment.replyTo,
    likeCount: comment.likeCount,
    liked: comment.liked ?? false
  }
}

const ResponseMappers = {
  user,
  userWithPassword,
  userWithPuuid,
  guide,
  populatedGuide,
  populatedGuideReport,
  comment
};

export default ResponseMappers
