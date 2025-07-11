export interface RunData {
  type: string;
  durationMin: number;
  workoutDate: string;
  calories?: number;
  notes?: string;
  runLog: {
    distanceInKms: number;
    shoe?: string;
  };
}
