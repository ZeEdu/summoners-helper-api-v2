import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { LoginUserDto } from '@org/contracts';
import { switchMap, tap } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-login',
  imports: [
    FormField,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  router = inject(Router);
  authService = inject(AuthService);
  sessionService = inject(SessionService);

  private loginModel = signal<LoginUserDto>({
    email: 'Jana_Fay73@yahoo.com',
    password: '1!AbIB7o0Yr6Qrx',
  });

  loginForm = form(this.loginModel);

  handleSubmit(evt: Event) {
    evt.preventDefault();

    const user = this.loginForm().value();

    this.authService
      .login(user)
      .pipe(
        switchMap(() => {
          return this.authService.getMe().pipe(
            tap((me) => {
              this.sessionService.setUser(me);
              console.log({ me });
            }),
          );
        }),
      )
      .subscribe((res) => {
        this.router.navigate(['']);
        console.log({ res });
      });

    // {
    //     "email": "Jana_Fay73@yahoo.com",
    //     "username": "NJIHWWvJJbNJUPZI",
    //     "password": "1!AbIB7o0Yr6Qrx"
    // }
  }
}
