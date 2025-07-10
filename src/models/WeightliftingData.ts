import { Exercise } from './Exercise';

export interface WeightliftingData {
  type: string;
  durationMin: number;
  workoutDate: string;
  calories?: number;
  notes?: string;
  weightliftingLog: {
    exercises: Exercise[];
  };
}
