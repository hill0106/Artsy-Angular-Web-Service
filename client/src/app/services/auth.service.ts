import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';  // Import HttpClient
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authState = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.authState.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private userSubject = new BehaviorSubject<any>(null);
  userData$ = this.userSubject.asObservable();

  initializeUser(): void {
    this.http.get<{ data: any }>('/api/user/me').pipe(
      tap(res => {
        if (res && res.data) {
          this.authState.next(true);
          this.userSubject.next(res);
        } 
      }),
      catchError(err => {
        this.authState.next(false);
        this.userSubject.next(null);
        return of(null);
      })
    ).subscribe();
  }


  register(formData: any): Observable<any> {
    return this.http.post<any>('/api/user/signup', formData).pipe(
      tap(response => {
        // console.log('Registration and login response:', response);
        this.initializeUser();
      })
    );
  }
  
  
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.post<boolean>(`/api/user/check`,{ email}).pipe(
      tap(response => {
        // console.log('Check Email response:', response);
      })
    );
  }



  // Log in a user by sending credentials to the backend
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>('/api/auth/login', credentials).pipe(
      switchMap(response => {
        if (response) {
          const headers = new HttpHeaders({
            'x-auth-token': response.data
          });
          return this.http.get(`/api/user/${response.id}`, {headers}).pipe(
            tap(user => {
              // console.log('User results:', user);
              this.authState.next(true);
              this.userSubject.next(user);
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }


  logout(): void {
    this.http.post<any>('/api/auth/logout', {}).pipe(
      tap(() => {
        // console.log('Logout successful');
        this.authState.next(false);
        this.userSubject.next(null);
      }),
      catchError(err => {
        console.error('Logout error:', err);
        return of(null);
      })
    ).subscribe({next: () => {
      this.router.navigate(['/search']).then(() => {
        window.location.reload(); // Force full state reset if needed
      });
      }
    });
  }

  delete(): void {
    this.http.delete<any>('/api/user/', {}).pipe(
      tap(() => {
        // console.log('Delete Account successful');
        this.authState.next(false);
        this.userSubject.next(null);
      }),
      catchError(err => {
        console.error('Delete Account error:', err);
        return of(null);
      })
    ).subscribe();
  }
}
