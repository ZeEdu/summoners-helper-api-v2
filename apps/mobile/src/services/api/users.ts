import { customFetch } from '../../utils/customFetch/customFetch';
import { AuthTokenStorageService } from '../auth-token-storage.service';
import { API_CONSTANTS } from './api.constants';

const ENDPOINT = 'users';

export const Users = {
  me: async () => {
    const url = `${API_CONSTANTS.API_URL}/${ENDPOINT}/me`;

    const tokens = await AuthTokenStorageService.get();

    if (!tokens.accessToken) {
      throw new Error('Tokens not found');
    }

    const init: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    };
    // No momento vai falhar pois precisa do refresh token na requisição
    // É necessário configurar corretamente para que o fetch o utilize
    return customFetch(url, init)
  },

  users: async () => {
    const url = `${API_CONSTANTS.API_URL}/${ENDPOINT}`;

    const tokens = await AuthTokenStorageService.get();

    if (!tokens.accessToken) {
      throw new Error('Tokens not found');
    }

    const init: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    };
    // No momento vai falhar pois precisa do refresh token na requisição
    // É necessário configurar corretamente para que o fetch o utilize
    return customFetch(url, init)
  }
};



// TODO Criar uma função que deve ser chamada sempre que o fetch falhar e for uma erro de token invalido
// Nesse cenário devesse atualizar os tokens
// o refresh deve ocorrer e a mesma request que falhou deve ser chamada novamente
// Mas antes é necessário que seja feito um retry
// É uma boa ideia retornar com o conceito de um uma função própria do fetch que lide com o retry e o refresh do token
