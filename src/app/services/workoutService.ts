import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { WeightliftingData } from '../../models/WeightliftingData';
import { RunData } from '../../models/RunData';
import { Workout } from '../../models/Workout';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  AddWorkout(model: WeightliftingData | RunData) {
    return this.http.post(`${this.baseUrl}workouts/add`, model, {
      withCredentials: true,
    });
  }

  DeleteWorkout(id: number) {
    return this.http.delete(`${this.baseUrl}workouts/delete/${id}`);
  }

  getAllWorkoutsForUser(userId: number, limit?: number): Observable<Workout[]> {
    return this.http
      .get<Workout[]>(`${this.baseUrl}workouts/for-user/${userId}`)
      .pipe(map((workouts) => (limit ? workouts.slice(0, limit) : workouts)));
  }

  getAllRunsForUser(userId: number): Observable<Workout[]> {
    return this.http.get<Workout[]>(
      `${this.baseUrl}workouts/get-runs/${userId}`
    );
  }

  getAllWeightliftingsForUser(userId: number): Observable<Workout[]> {
    return this.http.get<Workout[]>(
      `${this.baseUrl}workouts/get-gym-workouts/${userId}`
    );
  }

  getWorkoutCountForUser(userId: number) {
    return this.http.get<number>(`${this.baseUrl}workouts/count/${userId}`);
  }

  getWeightliftingCountForUser(userId: number) {
    return this.http.get<number>(
      `${this.baseUrl}workouts/lifting-count/${userId}`
    );
  }
  getRunCountForUser(userId: number) {
    return this.http.get<number>(`${this.baseUrl}workouts/run-count/${userId}`);
  }

  getWorkoutById(workoutId: number) {
    return this.http.get<Workout>(`${this.baseUrl}workouts/${workoutId}`);
  }
}
