import { Exercise } from './Exercise';

export interface WorkoutData {
  type: string;
  durationMin: number;
  workoutDate: Date;
  calories?: number;
  notes?: string;
  exercises?: Exercise[];
}
