import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { SearchService } from '../services/search.service';
import { AuthService } from '../services/auth.service';
import { ArtService } from '../services/art.service';
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent, FooterComponent, NotificationsComponent], // <-- Ensure FormsModule is included
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})



export class SearchComponent implements OnInit {
  private resultSubject = new BehaviorSubject<any>(null);
  resultData$ = this.resultSubject.asObservable();

  isAuthenticated$!: Observable<boolean>;

  searchTerm: string = '';
  loading: boolean = false;
  results: any[] | null = null;
  noResults: boolean | null = null;
  
  selectedArtistId: string | null = null;
  selectedArtist: any | null = null;
  selectedArtworkId: string | null = null;
  selectedArtwork: any | null = null;
  artistInfo: any = null;
  artworks: any[] = [];
  similarResults: any[] = [];
  categories: any[] = [];

  loadingInfo = false;
  loadingArtworks = false;
  loadingCategories = false;

  user: any = null;

  urlArtistId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private searchService: SearchService, 
    private route: ActivatedRoute, 
    private authService: AuthService, 
    private router: Router,
    private notifyService: NotificationService,
    private artService: ArtService
  ) {}

  ngOnInit(): void {
    this.results = null;
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    // this.isAuthenticated$.subscribe(val => console.log(val));
    this.authService.initializeUser();
    this.authService.userData$.subscribe(data => {
      this.user = data;
    });


    this.route.queryParamMap.subscribe(params => {
      const artistId = params.get('artist');
      this.urlArtistId = artistId; 
      if (artistId) {

        this.selectedArtistId = artistId;

        this.isAuthenticated$.subscribe(auth => {
          if (auth === true) {
            this.fetchAuthArtistInfo(artistId);
            this.fetchSmlrArtistInfo(artistId);
          }
          else {
            this.fetchArtistInfo(artistId);
          }
          this.fetchArtworks(artistId);
        });
        
      } 
    });


  }

  onSearch(event: Event): void {
    event.preventDefault(); 
    this.results = null;
    this.selectedArtist = null;
    this.selectedArtistId = null;
    this.artworks = [];
    this.artistInfo = [];

    if (!this.searchTerm) return;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { artist: null },
      queryParamsHandling: 'merge'
    });
    this.loading = true;
    this.searchService.getSearch(this.searchTerm).pipe(
      tap((res: any) => {
        if (res) {
          const results: any[] = res._embedded.results.map((item: any) => {
            const selfHref: string = item._links?.self?.href || '';
            const parts = selfHref.split('artists/');
            const artistId = parts.length > 1 ? parts[1] : '';
            return {
              artistId: artistId,
              title: item.title,
              isFavorite: this.checkArtistFavorite(artistId),
              image: item._links.thumbnail.href !== '/assets/shared/missing_image.png' ? item._links.thumbnail.href : 'assets/images/artsy_logo.svg'
            };
          });
          // this.resultSubject.next(results);
          this.results = results;
  
          this.loading = false;
        }
      }),
      catchError(err => {
        this.resultSubject.next(null);
        return of(null);
      })
    ).subscribe();
    
  }

  onClear(): void {
    this.searchTerm = '';
    // console.log('Cleared input');
    this.results = null;
    this.noResults = null;
    this.artworks = [];
    this.artistInfo = [];
    this.selectedArtist = null;
    this.selectedArtistId = null; 
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { artist: null },
      queryParamsHandling: 'merge'
    });
  }

  checkArtistFavorite(artistId: string): any {
    try {
      // console.log(artistId);
      if(this.user.data && Array.isArray(this.user.data.favorite)) {
        return this.user.data.favorite.some((fav: { artistId: string; }) => fav.artistId === artistId);
      }
    }
    catch (error) {
      return false;
    }
  }

  toggleFavorite(item: any): void {
    if (!item.isFavorite===true) {
        this.addToFavorites(item.artistId);
        item.isFavorite = !item.isFavorite;
    } else {
        this.removeFavorites(item.artistId);
        item.isFavorite = !item.isFavorite;
    }
    if (this.selectedArtist && this.selectedArtist.artistId === item.artistId) {
      this.selectedArtist.isFavorite = item.isFavorite;
    }
    const resultIdx = this.results?.findIndex(a => a.artistId === item.artistId) ?? -1;
    if (resultIdx > -1) {
      this.results![resultIdx].isFavorite = item.isFavorite;
    }
    if (this.artistInfo) {
      this.artistInfo.isFavorite = item.isFavorite;
    }
  }

  // toggleArtistFavorite(): void {
  //   if (this.selectedArtist) {
  //     this.selectedArtist.isFavorite = !this.selectedArtist.isFavorite;
  //     const idx = this.results!.findIndex(a => a.artistId === this.selectedArtist!.artistId);
  //     if (idx > -1) {
  //       this.results![idx].isFavorite = this.selectedArtist.isFavorite;
  //     }
  //   }

  //   if (this.selectedArtist?.isFavorite == true) {
  //     this.addToFavorites(this.selectedArtist.artistId);
  //   } else {
  //     this.removeFavorites(this.selectedArtist.artistId);
  //   }
  // }



  onCardClick(artistId: string): void {
    this.selectedArtistId = artistId;
    // console.log(this.results);
    this.selectedArtist = this.results?.find(item => item.id === artistId) || null;
    this.isAuthenticated$.subscribe(auth => {
      if (auth === true) {
        this.fetchAuthArtistInfo(artistId);
        this.fetchSmlrArtistInfo(artistId);      
        console.log(this.artistInfo);
        console.log(this.selectedArtist);
      }
      else {
        this.fetchArtistInfo(artistId);
      }

      this.fetchArtworks(artistId);
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { artist: artistId },
      queryParamsHandling: 'merge'
    });
  }

  onSmlrCardClick(artist: any): void {
    this.selectedArtistId = artist.artistId;
    this.selectedArtist = artist;

    this.isAuthenticated$.subscribe(auth => {
      if (auth === true) {
        this.fetchAuthArtistInfo(artist.artistId);
        this.fetchSmlrArtistInfo(artist.artistId);
      }
      else {
        this.fetchArtistInfo(artist.artistId);
      }
      this.fetchArtworks(artist.artistId);
    });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { artist: artist.artistId },
      queryParamsHandling: 'merge'
    });
  }

  fetchAuthArtistInfo(artistId: string): void {
    this.loadingInfo = true;
    this.artService.getAuthArtistInfo(artistId).subscribe({
      next: (item) => {
        const existingFavorite = this.results?.find(r => r.artistId === artistId)?.isFavorite || this.checkArtistFavorite(artistId);
        const results = {
          artistId: item.artistId,
          name: item.name,
          nationality: item.nationality,
          birthday: item.birthday,
          deathday: item.deathday,
          biography: item.biography,
          isFavorite: existingFavorite,
          image: item.image
        };
        this.artistInfo = results;
        this.selectedArtist = this.artistInfo;
        this.loadingInfo = false;
      },
      error: (err) => {
          console.error('Error fetching artist info:', err);
          this.loadingInfo = false;
      }
    });
  }



  fetchArtistInfo(artistId: string): void {
    this.loadingInfo = true;
    this.artService.getArtistInfo(artistId).subscribe({
      next: (item) => {
        const results = {
          artistId: item.artistId,
          name: item.name,
          nationality: item.nationality,
          birthday: item.birthday,
          deathday: item.deathday,
          biography: item.biography,
          isFavorite: this.checkArtistFavorite(artistId),
          image: item.image
        };
        this.artistInfo = results;
        // this.selectedArtist = this.artistInfo;
        this.loadingInfo = false;
      },
      error: (err) => {
          console.error('Error fetching artist info:', err);
          this.loadingInfo = false;
      }
    });
    
  }

  fetchSmlrArtistInfo(artistId: string, attempt: number = 0): void {
    
    this.artService.getSmlrArtistInfo(artistId).subscribe({
      next: (data) => {
        this.similarResults = data;
      },
      error: (err) => {
          console.error('Error fetching artist info:', err);
          this.loadingInfo = false;
      }
    });
  }

  fetchArtworks(artistId: string): void {
    this.loadingArtworks = true;

    this.artService.getArtistArtworks(artistId).pipe(
      tap((res: any) => {
          if (res) {
            this.artworks = res._embedded.artworks;
            this.loadingArtworks = false;
            localStorage.setItem('artworks', JSON.stringify(this.artworks));
          }
        }),
        catchError(err => {
          console.error('Error fetching artwork info:', err);
          this.loadingArtworks = false;
          return of(null);
        })
      ).subscribe();
  }


  openCategories(artwork: any): void {
    this.selectedArtworkId = artwork.id;
    this.selectedArtwork = this.artworks.find(item => item.id === this.selectedArtworkId) || null;
    // console.log('Selected artwork:', this.selectedArtwork);
    this.loadingCategories = true;
    this.artService.getArtistGenes(artwork.id).pipe(
      tap((res: any) => {
          if (res) {
            this.categories = res._embedded.genes;
            // console.log('Categories:', this.categories);
            this.loadingCategories = false;
          }
        }),
        catchError(err => {
          console.error('Error fetching gene info:', err);
          this.loadingCategories = false;
          return of(null);
        })
      ).subscribe();

  }

  formatBiography(): string {
    if (!this.artistInfo?.biography) return '';
    
    return this.artistInfo.biography
      .replace(/\n\n/g, '</p><p>')  
      .replace(/\n/g, '<br/>')      
      .replace(/- /g, '');          
  }

  addToFavorites(artistId: string): void {
    this.artService.addArtist(artistId).subscribe({
      next: (res) => {
        // console.log('Added to favorites:', res);
        this.notifyService.show('Added to favorites', 'success');
      },
      error: (err) => {
        console.error('Error adding to favorites:', err);
      }
    });
  }

  removeFavorites(artistId: string): void {
    this.artService.rmvArtist(artistId).subscribe({
      next: (res) => {
        // console.log('Remove from favorites:', res);
        this.notifyService.show('Removed from favorites', 'danger');
      },
      error: (err) => {
        console.error('Error adding to favorites:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
