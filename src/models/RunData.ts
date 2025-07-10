export interface RunData {
  type: string;
  durationMin: number;
  workoutDate: Date;
  calories?: number;
  notes?: string;
  runLog: {
    distanceInKms: number;
    shoes?: string;
  };
}
