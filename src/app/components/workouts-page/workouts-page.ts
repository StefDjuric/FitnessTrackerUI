import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Workout } from '../../../models/Workout';
import { Button } from '../button/button';
import { WorkoutService } from '../../services/workoutService';
import { ToastrService } from 'ngx-toastr';
import { Account } from '../../services/account';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-workouts-page',
  imports: [DatePipe, Button, RouterLink],
  templateUrl: './workouts-page.html',
  styleUrl: './workouts-page.css',
})
export class WorkoutsPage implements OnInit {
  workoutService = inject(WorkoutService);
  private toastrService = inject(ToastrService);
  private accountService = inject(Account);
  private userId = this.accountService.getUserIdFromToken();
  userWorkouts: Workout[] = [];

  ngOnInit(): void {
    this.getWorkoutsForUser(this.userId);
  }

  getWorkoutsForUser(userId: number | null) {
    if (userId === null) return console.error('No userId found in token.');

    this.workoutService.getAllWorkoutsForUser(userId).subscribe({
      next: (workouts) => {
        this.userWorkouts = workouts;
      },
      error: (err) => {
        this.toastrService.error('Could not fetch user workouts.');
        console.error(err);
      },
    });
  }
}
