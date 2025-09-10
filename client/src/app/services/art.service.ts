import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArtService {
  constructor(private http: HttpClient) {}

  getArtistInfo(artistId: string): Observable<any> {
    return this.http.get<any>(`/api/artist/${artistId}`);
  }

  getAuthArtistInfo(artistId: string): Observable<any> {
    return this.http.get<any>(`/api/artist/auth/${artistId}`);
  }

  getSmlrArtistInfo(artistId: string): Observable<any> {
    return this.http.get<any>(`/api/artist/smlr/${artistId}`);
  }

  getArtistArtworks(artistId: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/artwork/${artistId}`);
  }

  getArtistGenes(artworkId: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/gene/${artworkId}`);
  }

  addArtist(artistId: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/user/liked/${artistId}`);
  }

  rmvArtist(artistId: string): Observable<any[]> {
    return this.http.delete<any[]>(`/api/user/rmliked/${artistId}`);
  }
}
