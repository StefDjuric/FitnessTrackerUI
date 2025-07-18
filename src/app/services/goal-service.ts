import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Goals } from '../../models/Goals';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private baseUrl = environment.baseUrl;
  private http = inject(HttpClient);

  SetGoals(goalsDto: Goals) {
    return this.http.post(`${this.baseUrl}goals/add`, goalsDto, {
      withCredentials: true,
    });
  }

  GetCurrentGoalsForUser(userId: number): Observable<Goals> {
    return this.http.get<Goals>(`${this.baseUrl}goals/for-user/${userId}`);
  }
}
