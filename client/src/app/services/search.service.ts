import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {

  constructor(private http: HttpClient) {}

  getSearch(query: string): Observable<any[]> {
    return this.http.get<any>(`/api/search?q=${encodeURIComponent(query)}`);
  }

  getArtistArtworks(artistId: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/artist/${artistId}/artworks`);
  }
}
