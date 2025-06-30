import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../../models/User';
import { map, Observable } from 'rxjs';
import { RegisterDto } from '../../models/RegisterDto';

@Injectable({
  providedIn: 'root',
})
export class Account {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
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
  }
}
