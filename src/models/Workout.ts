import { Exercise } from './Exercise';

export interface Workout {
  id?: number;
  type: string;
  durationMin: number;
  workoutDate: string;
  calories?: number;
  notes?: string;
  weightliftingLog?: {
    exercises: Exercise[];
  };
  runLog?: {
    distanceInKms: number;
    shoe?: string;
  };
}
