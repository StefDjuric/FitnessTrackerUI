import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { WeightEntry } from '../../models/WeightEntry';

@Injectable({
  providedIn: 'root',
})
export class WeightEntryService {
  private baseUrl = environment.baseUrl;
  private http = inject(HttpClient);

  getWeightEntriesForUser(inPastDays: number) {
    return this.http.get<WeightEntry[]>(
      `${this.baseUrl}weightentries/for-user?days=${inPastDays}`
    );
  }

  addWeightEntry(model: WeightEntry) {
    return this.http.post(`${this.baseUrl}weightentries/add`, model);
  }

  deleteWeightEntry(id: number) {
    return this.http.delete(`${this.baseUrl}weightentries/${id}`);
  }
}
