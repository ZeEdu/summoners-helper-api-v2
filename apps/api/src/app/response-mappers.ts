import { GuideDto, IComment, IGuide, IPopulatedReport, IPopulatedReportDto, ISerializedComment, IUser, PopulatedGuideDto, UserDto, UserDtoWithPassword, UserDtoWithPuuid, UserDtoWithRefreshToken } from "@org/contracts";
import { Types } from "mongoose";
import { IUserWithPassword, IUserWithPuuid, IUserWithRefreshToken } from "./users/schema/user.schema";

function user(user: IUser): UserDto {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    gameName: user.gameName,
    tagLine: user.tagLine,
    server: user.server,
    puuid: user.puuid,
    isSystemAdmin: user.isSystemAdmin
  }
}

function userWithRefreshToken(userData: IUserWithRefreshToken): UserDtoWithRefreshToken {
  return {
    ...user(userData),
    refreshToken: userData.refreshToken
  }
}

function userWithPassword(userData: IUserWithPassword): UserDtoWithPassword {
  return {
    ...user(userData),
    password: userData.password
  }
}

function userWithPuuid(userData: IUserWithPuuid): UserDtoWithPuuid {
  return {
    ...user(userData),
    puuid: userData.puuid,

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

function populatedReport(report: IPopulatedReport): IPopulatedReportDto {
  return {
    id: report._id.toString(),
    reportedBy: user(report.reportedBy),
    createdAt: report.createdAt,
    reason: report.reason,
    observation: report.observation,
    status: report.status,
    actionTaken: report.actionTaken,
    ...(!!report.guide && { guide: populatedGuide(report.guide) }),
    ...(!!report.comment && { comment: comment(report.comment) })
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

  const content = comment.blocked ? comment.content : 'Comentário bloquado pela moderação'

  return {
    createdBy: (commentCreatedBy ?? comment.createdBy),
    guide: (commentGuide ?? comment.guide),
    id: comment._id.toString(),
    createdAt: comment.createdAt,
    removed: comment.removed,
    replyTo: comment.replyTo,
    likeCount: comment.likeCount,
    liked: comment.liked ?? false,
    content,
  }
}

const ResponseMappers = {
  user,
  userWithPassword,
  userWithPuuid,
  userWithRefreshToken,
  guide,
  populatedGuide,
  populatedReport,
  comment
};

export default ResponseMappers
