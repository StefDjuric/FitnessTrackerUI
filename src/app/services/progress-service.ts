import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { WeeklyProgress } from '../../models/WeeklyProgress';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  getWeeklyProgressByUserId(userId: number): Observable<WeeklyProgress> {
    return this.http.get<WeeklyProgress>(
      `${this.baseUrl}progress/for-user/${userId}`
    );
  }

  initWeeklyProgress() {
    return this.http.post(
      `${this.baseUrl}progress/add`,
      {},
      { withCredentials: true }
    );
  }

  patchWeeklyProgress(userId: number, model: WeeklyProgress) {
    return this.http.patch(`${this.baseUrl}progress/${userId}`, model, {
      withCredentials: true,
    });
  }
}
