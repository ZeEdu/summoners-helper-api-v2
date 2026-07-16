import { ICreateUserDto, ILoginUserDto } from '@org/shared-types';
import { API_CONSTANTS } from './api.constants';
import { AuthTokenStorageService } from '../auth-token-storage.service';

const AUTH_ENDPOINT = 'auth';

export const Auth = {
  login: (loginUserDto: ILoginUserDto) => {
    const url = `${API_CONSTANTS.API_URL}/${AUTH_ENDPOINT}/mobile/login`;
    const init: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginUserDto),
    };
    return fetch(url, init);
  },
  logout: () => { },
  register: async (createUserDto: ICreateUserDto) => {
    const url = `${API_CONSTANTS.API_URL}/${AUTH_ENDPOINT}/mobile/register`;
    const init: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createUserDto),
    };
    return fetch(url, init);
  },
  refreshToken: async () => {
    const url = `${API_CONSTANTS.API_URL}/${AUTH_ENDPOINT}/mobile/refresh`;

    const tokens = await AuthTokenStorageService.get();
    if (!tokens.refreshToken) {
      throw new Error('Token not found');
    }

    const init: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    };
    return fetch(url, init);
  },
};
