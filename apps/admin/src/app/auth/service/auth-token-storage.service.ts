import { Injectable } from '@angular/core';

const ACCESS_TOKEN = 'access_token'

@Injectable({
  providedIn: 'root',
})
export class AuthTokenStorageService {
  set(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN, accessToken)
  }
  get() {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    return { accessToken }
  }
  delete() {
    localStorage.removeItem(ACCESS_TOKEN)
  }
}
