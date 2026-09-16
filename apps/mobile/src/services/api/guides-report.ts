import { CreateGuideReportFormDto, IGuide } from '@org/contracts';

import { customFetch } from '../../utils/customFetch/customFetch';
import { AuthTokenStorageService } from '../auth-token-storage.service';
import { API_CONSTANTS } from './api.constants';

const ENDPOINT = 'guide-report';

export const GuideReport = {
  create: async (createGuideReportDto: CreateGuideReportFormDto): Promise<IGuide> => {
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
      body: JSON.stringify(createGuideReportDto),
    };

    return customFetch(url, init);
  }
};

// TODO Criar uma função que deve ser chamada sempre que o fetch falhar e for uma erro de token invalido
// Nesse cenário devesse atualizar os tokens
// o refresh deve ocorrer e a mesma request que falhou deve ser chamada novamente
// Mas antes é necessário que seja feito um retry
// É uma boa ideia retornar com o conceito de um uma função própria do fetch que lide com o retry e o refresh do token
