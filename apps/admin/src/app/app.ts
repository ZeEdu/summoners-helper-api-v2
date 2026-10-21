import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/service/auth.service';
import { SessionService } from './auth/service/session.service';
import { CONFIRM_LOGOUT_ACTIONS, ConfirmUserLogout } from './components/confirm-user-logout';
import { DataDragonService } from './data-dragon/data-dragon.service';
import { EventBusService } from './services/event-bus.service';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  imports: [
    RouterModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);

  authService = inject(AuthService)
  sessionService = inject(SessionService);
  dataDragonService = inject(DataDragonService)
  eventBusService = inject(EventBusService)

  showToolbar = computed(() => !!this.sessionService.user());

  eventBusSub?: Subscription

  protected title = 'admin';

  isLoggingOut = false

  ngOnInit(): void {
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.handleLogout()
    })
  }

  ngOnDestroy() {
    this.eventBusSub?.unsubscribe()
  }

  handleLogout() {
    if (this.isLoggingOut) return

    this.isLoggingOut = true
    this.authService.logout().subscribe({
      next: () => {
        window.location.reload()
      },
      error: (err) => {
        this.sessionService.removeUser();
        this.isLoggingOut = false;
        window.location.reload()
        console.log({ err });
      }
    })
  }

  confirmUserLogoutIntention() {
    const dialogRef = this.dialog.open(ConfirmUserLogout)

    dialogRef
      .afterClosed()
      .subscribe({
        next: (result) => {
          console.log({ result });

          if (result === CONFIRM_LOGOUT_ACTIONS.CONFIRM) {
            this.handleLogout()
          }
        }
      })
  }
}
