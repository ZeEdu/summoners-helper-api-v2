
import { ICreateUserDto, ILoginUserDto } from '@org/contracts';

import { customFetch } from '../../utils/customFetch/customFetch';
import Utils from '../../utils/utils';
import { AuthTokenStorageService } from '../auth-token-storage.service';
import { API_CONSTANTS } from './api.constants';

const AUTH_ENDPOINT = 'auth';
const MOBILE_URL = Utils.isWeb ? 'web' : 'mobile'

export const Auth = {
  login: (loginUserDto: ILoginUserDto) => {
    const url = `${API_CONSTANTS.API_URL}/${AUTH_ENDPOINT}/${MOBILE_URL}/login`;
    const init: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(loginUserDto),
    };
    return customFetch<{ accessToken: string; refreshToken: string }>(
      url,
      init,
    );
  },
  logout: async () => {
    const url = `${API_CONSTANTS.API_URL}/${AUTH_ENDPOINT}/logout`;
    const tokens = await AuthTokenStorageService.get();

    if (!tokens.accessToken) {
      throw new Error('Tokens not found');
    }

    const init: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    };

    return customFetch(url, init);
  },
  register: async (createUserDto: ICreateUserDto) => {
    const url = `${API_CONSTANTS.API_URL}/${AUTH_ENDPOINT}/${MOBILE_URL}/register`;
    const init: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(createUserDto),
    };
    return customFetch<{ accessToken: string; refreshToken: string }>(
      url,
      init,
    );
  }
};
