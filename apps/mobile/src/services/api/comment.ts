import { customFetch } from "../../utils/customFetch/customFetch";
import { AuthTokenStorageService } from "../auth-token-storage.service";
import { API_CONSTANTS } from "./api.constants";

import { CommentPaginationDto, CreateCommentFormType, CreateCommentReplyFormType, ISerializedComment } from "@org/contracts";

const ENDPOINT = 'comments';

const buildQueryStringFromDto = (query: Record<string, any | undefined>) => {
  return Object.entries(query)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== '',
    )
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

export const Comments = {
  get: async (commentsPagination: CommentPaginationDto): Promise<{ comments: ISerializedComment[], count: number }> => {
    const queryParams = buildQueryStringFromDto(commentsPagination);
    const url = `${API_CONSTANTS.API_URL}/${ENDPOINT}?${queryParams}`;

    const tokens = await AuthTokenStorageService.get();
    if (!tokens.accessToken) {
      throw new Error('Tokens not found');
    }

    const init: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    };

    return customFetch(url, init);
  },
  create: async (createCommentDto: CreateCommentFormType) => {
    const url = `${API_CONSTANTS.API_URL}/${ENDPOINT}`;

    const tokens = await AuthTokenStorageService.get();
    if (!tokens.accessToken) {
      throw new Error('Tokens not found');
    }

    const init: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(createCommentDto),
    };

    return customFetch<ISerializedComment>(url, init);
  },

  reply: async (replyCommentDto: CreateCommentReplyFormType) => {
    const url = `${API_CONSTANTS.API_URL}/${ENDPOINT}/reply`;

    const tokens = await AuthTokenStorageService.get();
    if (!tokens.accessToken) {
      throw new Error('Tokens not found');
    }

    const init: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(replyCommentDto),
    };

    return customFetch<ISerializedComment>(url, init);
  },
  like: async (commentId: string) => {
    const url = `${API_CONSTANTS.API_URL}/${ENDPOINT}/like/${commentId}`;

    const tokens = await AuthTokenStorageService.get();
    if (!tokens.accessToken) {
      throw new Error('Tokens not found');
    }

    const init: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    };

    return customFetch<void>(url, init);
  },
  unlike: async (commentId: string) => {
    const url = `${API_CONSTANTS.API_URL}/${ENDPOINT}/unlike/${commentId}`;

    const tokens = await AuthTokenStorageService.get();
    if (!tokens.accessToken) {
      throw new Error('Tokens not found');
    }

    const init: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    };

    return customFetch<void>(url, init);
  }
};