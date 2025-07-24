import { Component, inject, OnInit } from '@angular/core';
import { WorkoutService } from '../../services/workoutService';
import { Workout } from '../../../models/Workout';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-workout-info',
  imports: [DatePipe],
  templateUrl: './workout-info.html',
  styleUrl: './workout-info.css',
})
export class WorkoutInfo implements OnInit {
  workoutService = inject(WorkoutService);
  workout: Workout | null = null;
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  workoutId: string | null = null;

  ngOnInit(): void {
    this.workoutId = this.route.snapshot.paramMap.get('workoutId');
    if (!!this.workoutId) this.getWorkoutById(parseInt(this.workoutId));
  }

  getWorkoutById(workoutId: number | null) {
    if (workoutId === null) return console.error('No workoutId found in url.');

    this.workoutService.getWorkoutById(workoutId).subscribe({
      next: (workout) => {
        this.workout = workout;
      },
      error: (err) => {
        this.toastr.error('Could not fetch workout by id.');
        console.error(err);
      },
    });
  }
}
