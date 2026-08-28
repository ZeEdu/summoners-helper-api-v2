import { CreateGuideFormDto, GuidePaginationDto, IGuide } from '@org/contracts';

import { customFetch } from '../../utils/customFetch/customFetch';
import { AuthTokenStorageService } from '../auth-token-storage.service';
import { API_CONSTANTS } from './api.constants';

const ENDPOINT = 'guides';

const buildQueryStringFromDto = (query: Record<string, any | undefined>) => {
  return Object.entries(query)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

export const Guides = {
  create: async (createGuideDto: CreateGuideFormDto): Promise<IGuide> => {
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
      body: JSON.stringify(createGuideDto),
    };

    return customFetch<IGuide>(url, init);
  },

  patch: async (guideId: string, createGuideDto: CreateGuideFormDto): Promise<IGuide> => {
    const url = `${API_CONSTANTS.API_URL}/${ENDPOINT}/${guideId}`;

    const tokens = await AuthTokenStorageService.get();
    if (!tokens.accessToken) {
      throw new Error('Tokens not found');
    }

    const init: RequestInit = {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(createGuideDto),
    };

    return customFetch<IGuide>(url, init);
  },

  get: async (
    guidePagination: GuidePaginationDto,
  ): Promise<{ guides: IGuide[]; count: number }> => {
    const queryParams = buildQueryStringFromDto(guidePagination)
    console.log({ queryParams });
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
    };

    return customFetch(url, init);
  },
};

// TODO Criar uma função que deve ser chamada sempre que o fetch falhar e for uma erro de token invalido
// Nesse cenário devesse atualizar os tokens
// o refresh deve ocorrer e a mesma request que falhou deve ser chamada novamente
// Mas antes é necessário que seja feito um retry
// É uma boa ideia retornar com o conceito de um uma função própria do fetch que lide com o retry e o refresh do token
