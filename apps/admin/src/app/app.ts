import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/service/auth.service';
import { SessionService } from './auth/service/session.service';
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
  authService = inject(AuthService)
  sessionService = inject(SessionService);
  dataDragonService = inject(DataDragonService)
  eventBusService = inject(EventBusService)

  showToolbar = !!this.sessionService.user();

  eventBusSub?: Subscription

  protected title = 'admin';

  ngOnInit(): void {
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.handleLogout()
    })
  }

  ngOnDestroy() {
    this.eventBusSub?.unsubscribe()
  }

  handleLogout() {
    this.authService.logout().subscribe({
      next: () => {
        window.location.reload()
      },
      error: (err) => {
        console.log({ err });
      }
    })
  }
}
