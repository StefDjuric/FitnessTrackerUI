import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../../models/User';
import { map, Observable } from 'rxjs';
import { RegisterDto } from '../../models/RegisterDto';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ProfileForm, UpdateProfileRequest } from '../../models/Profile-form';

@Injectable({
  providedIn: 'root',
})
export class Account {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  private toastr = inject(ToastrService);
  private router = inject(Router);
  currentUser = signal<User | null>(null);

  login(model: {
    emailOrUsername: string;
    password: string;
  }): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}account/login`, model).pipe(
      map((user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
        return user;
      })
    );
  }

  register(model: RegisterDto) {
    return this.http
      .post<User>(`${this.baseUrl}account/register`, model, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        map((user) => {
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUser.set(user);
          }
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.toastr.success('Successfully logged out.');
    this.router.navigateByUrl('/');
  }

  private decodeJwtToken(token: string) {
    try {
      const base64Ul = token.split('.')[1];
      const base64 = base64Ul.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((char) => '%' + char.charCodeAt(0).toString(16).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT token: ', error);
      return null;
    }
  }

  editProfile(editPayload: ProfileForm) {
    return this.http.patch(`${this.baseUrl}profile`, editPayload);
  }

  getUserIdFromToken(): number | null {
    const user = this.currentUser();
    if (user && user.token) {
      const decodedToken = this.decodeJwtToken(user.token);
      return parseInt(decodedToken?.nameid) || null;
    }
    return null;
  }

  getUsernameFromToken(): string | null {
    const user = this.currentUser();
    if (user && user.token) {
      const decodedToken = this.decodeJwtToken(user.token);
      return decodedToken?.unique_name;
    }
    return null;
  }

  getEmailFromToken(): string | null {
    const user = this.currentUser();
    if (user && user.token) {
      const decodedToken = this.decodeJwtToken(user.token);
      return decodedToken?.email;
    }
    return null;
  }
}
