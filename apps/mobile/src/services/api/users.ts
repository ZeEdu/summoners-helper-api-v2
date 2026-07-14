import { AuthTokenStorageService } from '../auth-token-storage.service';

const API_URL = 'http://localhost:3000/api';
const ENDPOINT = 'users';

export const Users = {
  me: async () => {
    const url = `${API_URL}/${ENDPOINT}/me`;

    const tokens = await AuthTokenStorageService.get();

    if (!tokens.accessToken || !tokens.refreshToken) {
      throw new Error('Tokens not found');
    }
    console.log({ tokens });

    const init: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    };
    // No momento vai falhar pois precisa do refresh token na requisição
    // É necessário configurar corretamente para que o fetch o utilize
    return fetch(url, init);
  },
};
