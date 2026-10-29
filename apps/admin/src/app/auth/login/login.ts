import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginUserDto } from '@org/contracts';
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
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  router = inject(Router);
  snackBar = inject(MatSnackBar)

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
      .setupLogin(user)
      .subscribe({
        next: (me) => {
          this.sessionService.setUser(me);
          this.router.navigate(['']);
        },
        error: (err) => {
          console.log({ err });
          this.snackBar.open('Um erro ocorreu ao realizar o login. Tente novamente', 'Ok')
        }
      });

    // {
    //     "email": "Jana_Fay73@yahoo.com",
    //     "username": "NJIHWWvJJbNJUPZI",
    //     "password": "1!AbIB7o0Yr6Qrx"
    // }
  }
}
