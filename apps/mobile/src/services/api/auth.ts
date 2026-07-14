import { ICreateUserDto } from '@org/shared-types';
import { API_CONSTANTS } from './api.constants';

const AUTH_ENDPOINT = 'auth';

export const Auth = {
  login: () => { },
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
  refreshToken: () => { },
};
