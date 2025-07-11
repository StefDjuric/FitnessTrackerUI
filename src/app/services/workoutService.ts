import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { WeightliftingData } from '../../models/WeightliftingData';
import { RunData } from '../../models/RunData';

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
}
