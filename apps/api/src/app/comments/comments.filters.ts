import { QueryFilter } from "mongoose"

import { CommentPaginationDto } from "@org/contracts"

import { Comment } from "./schema/comment.schema"

function get(query: CommentPaginationDto): QueryFilter<Comment> {
  const filter: QueryFilter<Comment> = {}

  if (query.guide) {
    filter.guide = query.guide
  }

  if (query.createdBy) {
    filter.createdBy = query.createdBy
  }

  if (query.replyTo) {
    filter.replyTo = query.replyTo
  } else {
    filter.replyTo = null
  }

  if (query.id) {
    filter.id = query.id
  }

  return filter
}


const CommentsFilters = {
  get
}

export default CommentsFilters