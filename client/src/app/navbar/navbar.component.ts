import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    NotificationsComponent
  ],
  styleUrls: ['./navbar.component.css']
})
export class NavComponent implements OnInit {
  isAuthenticated$!: Observable<boolean>;
  user: any = null;

  constructor(public authService: AuthService, private notificationService: NotificationService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    // this.isAuthenticated$.subscribe(val => console.log('Auth state:', val));

    this.authService.userData$.subscribe(data => {
      this.user = data;
    });
  }

  notify(type: any): void {
    if (type == 1) {
      this.authService.delete();
      this.notificationService.show('Account deleted', 'danger');
    }
    else {
      this.authService.logout();
      this.notificationService.show('Logged out', 'success');
    }
  }

  isSearchActive(): boolean {
    const tree = this.router.parseUrl(this.router.url);
    const primarySegments = tree.root.children['primary']?.segments;
    return primarySegments ? primarySegments.length === 0 : false;
  }
}