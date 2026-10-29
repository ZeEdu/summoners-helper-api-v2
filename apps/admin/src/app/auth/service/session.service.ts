import { Injectable, signal } from '@angular/core';

import { UserDto } from '@org/contracts';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly _user = signal<UserDto | undefined>(undefined);

  readonly user = this._user.asReadonly();

  setUser(user: UserDto) {
    this._user.set(user);
  }

  removeUser() {
    this._user.set(undefined);
  }
}
