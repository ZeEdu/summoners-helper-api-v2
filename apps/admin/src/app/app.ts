import { TitleCasePipe } from '@angular/common';
import { AfterViewInit, Component, computed, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
    TitleCasePipe
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatDrawer) drawer!: MatDrawer;

  readonly dialog = inject(MatDialog);

  authService = inject(AuthService)
  sessionService = inject(SessionService);
  dataDragonService = inject(DataDragonService)
  eventBusService = inject(EventBusService)
  activatedRoute = inject(ActivatedRoute)

  showToolbar = computed(() => !!this.sessionService.user());

  eventBusSub?: Subscription

  protected title = 'admin';

  isLoggingOut = false

  listItems = [
    {
      title: 'Guias',
      icon: 'report_problem',
      onClick: () => {
        this.handleDrawerClick('guide')
      }
    },
    {
      title: 'Comentários',
      icon: 'comment',
      onClick: () => {
        this.handleDrawerClick('comments')
      }
    }
  ]

  routes = [
    {
      title: 'Início',
      link: '',
      icon: 'home'
    },

    {
      title: 'Comentários',
      link: 'comment',
      icon: 'comment'
    },
    {
      title: 'Guias',
      link: 'guide',
      icon: 'report_problem',
    }
  ];
  activeLink = signal<string | null>(null);

  ngOnInit(): void {
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.handleLogout()
    })

    this.activatedRoute.fragment.subscribe((fragment) => {
      console.log({ fragment });
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log(`ngAfterViewInit`);
      this.drawer.toggle()
    }, 500);
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


  handleDrawerClick(page: string) {
    console.log('handleDrawerClick', page);
  }
}
