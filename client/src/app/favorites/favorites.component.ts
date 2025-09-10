import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { NotificationsComponent } from '../notifications/notifications.component';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { ArtService } from '../services/art.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-favorites',
  imports: [CommonModule,   NavComponent, NotificationsComponent, FooterComponent, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit, OnDestroy {
  loadingFavorites = false;
  favorites: any[] = [];

  currentTime: number = new Date().getTime();
  private timerId: any;

  user: any = null;

  constructor(private router: Router, private notifyService: NotificationService, private artService: ArtService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadingFavorites = true;
    this.authService.initializeUser();
    this.authService.userData$.subscribe(res => {
      this.user = res;
      this.getFavorites();
    });
    this.timerId = setInterval(() => {
      this.currentTime = new Date().getTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  removeFavorites(artistId: string, event: Event): void {
    event.stopPropagation();

    this.favorites = this.favorites.filter(fav => fav.artistId !== artistId);
    this.artService.rmvArtist(artistId).subscribe({
      next: (res) => {
        // console.log('Remove from favorites:', res);
        this.notifyService.show('Removed from favorites', 'danger');
        // this.toggleArtistFavorite();
      },
      error: (err) => {
        console.error('Error adding to favorites:', err);
      }
    });
  }

  getRelativeTime(date: Date | string | null | undefined): any {
    if (!date) {
      return 0; 
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return 0; 
    }
    const now = new Date().getTime();
    const diff = now - dateObj.getTime(); 

    const seconds = Math.floor(diff / 1000);
    if (seconds <= 60) {
      return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  goToArtistDetail(artistId: string): void {
    this.router.navigate(["/"], {
      queryParams: { artist: artistId },
      queryParamsHandling: 'merge'
    })
    // .then(() => {
    //   window.location.reload();
    // });
  }


  getFavorites(): void {
    if(this.user) {
      const validFavorites = this.user.data.favorite.filter((fav: { artistId: any; likedAt: any; }) => 
        fav && fav.artistId && fav.likedAt
      );
      this.favorites = validFavorites.sort((a: { likedAt: string | number | Date; }, b: { likedAt: string | number | Date; }) => {
          const dateA = new Date(a.likedAt).getTime();
          const dateB = new Date(b.likedAt).getTime();
          return dateB - dateA; 
      }
      );
      this.favorites = this.favorites.sort();
    }
    else {
      this.favorites = [];
    }
    if(this.favorites.length > 0) {
      this.loadingFavorites = false;
      this.favorites.map(i => this.getRelativeTime(i.likedAt));
    }
    else {
      this.loadingFavorites = false;
    }
  }
}


