import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { LoginUserDto, UserDto } from '@org/contracts';
import { finalize, Observable, shareReplay, tap } from 'rxjs';
import { API_CONSTANTS } from '../../endpoint.constants';
import { AuthTokenStorageService } from './auth-token-storage.service';

const AUTH_ENDPOINT = 'auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private refreshRequest$?: Observable<{ accessToken: string }> = undefined

  private http = inject(HttpClient)
  private authTokenStorageService = inject(AuthTokenStorageService)

  private endpoint = `${API_CONSTANTS.API_URL}/${AUTH_ENDPOINT}`

  login(user: LoginUserDto) {
    return this.http
      .post<{ accessToken: string }>(`${this.endpoint}/admin/login`, user, {
        withCredentials: true
      })
      .pipe(
        tap(({ accessToken }) => {
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
        finalize(() => {
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
    if (!this.refreshRequest$) {
      this.refreshRequest$ = this.http
        .post<{ accessToken: string }>(`${API_CONSTANTS.API_URL}/${AUTH_ENDPOINT}/web/refresh`, {}, {
          withCredentials: true
        }).pipe(
          tap(({ accessToken }) => {
            this.authTokenStorageService.set(accessToken)
          }),
          finalize(() => {
            this.refreshRequest$ = undefined
          }),
          shareReplay({ bufferSize: 1, refCount: false })
        )
    }

    return this.refreshRequest$
  }
}
