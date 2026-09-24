import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { LoginUserDto, UserDto } from '@org/contracts';
import { shareReplay, tap } from 'rxjs';
import { API_CONSTANTS } from '../../endpoint.constants';
import { AuthTokenStorageService } from './auth-token-storage.service';

const AUTH_ENDPOINT = 'auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)
  private authTokenStorageService = inject(AuthTokenStorageService)

  private endpoint = `${API_CONSTANTS.API_URL}/${AUTH_ENDPOINT}`

  login(user: LoginUserDto) {
    return this.http
      .post<{ accessToken: string }>(`${this.endpoint}/admin/login`, user, {
        withCredentials: true
      })
      .pipe(
        shareReplay(),
        tap(({ accessToken }) => {
          console.log({ accessToken });
          this.authTokenStorageService.set(accessToken)
        })
      )
  }

  logout() {
    return this.http
      .post(`${this.endpoint}/logout`, {}, {
        withCredentials: true
      })
      .pipe(
        tap(() => {
          this.authTokenStorageService.delete()
        })
      )
  }

  getMe() {
    return this.http.get<UserDto>(`${API_CONSTANTS.API_URL}/users/me`, {
      withCredentials: true
    })
  }

  refreshToken() {
    // TODO: Criar algo semelhante ao customFetch para o admin
    // Algo com refresh e expiração de sessão
    return this.http
      .post<{ accessToken: string }>(`${API_CONSTANTS.API_URL}/${AUTH_ENDPOINT}/web/refresh`, {}, {
        withCredentials: true
      })
      .pipe(
        shareReplay(),
        tap(({ accessToken }) => {
          this.authTokenStorageService.set(accessToken)
        })
      )
  }
}
