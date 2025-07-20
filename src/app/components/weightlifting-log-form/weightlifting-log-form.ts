import { Component, inject, OnInit, Pipe } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WeightliftingData } from '../../../models/WeightliftingData';
import { Button } from '../button/button';
import { WorkoutService } from '../../services/workoutService';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ProgressService } from '../../services/progress-service';
import { WeeklyProgress } from '../../../models/WeeklyProgress';
import { Account } from '../../services/account';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-weightlifting-log-form',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './weightlifting-log-form.html',
  styleUrl: './weightlifting-log-form.css',
})
export class WeightliftingLogForm implements OnInit {
  workoutForm: FormGroup = new FormGroup({});
  isSubmitting: boolean = false;
  accountService = inject(Account);
  workoutService: WorkoutService = inject(WorkoutService);
  progressService = inject(ProgressService);
  toastr = inject(ToastrService);
  router = inject(Router);
  userId: number | null = this.accountService.getUserIdFromToken();
  weeklyProgress: WeeklyProgress = {
    mealsEaten: 0,
    waterConsumed: 0,
    weekStartDate: new Date(Date.now()),
    workoutsDone: 0,
  };
  hasWeeklyProgress: boolean = false;

  constructor(private fb: FormBuilder) {
    this.workoutForm = this.fb.group({
      type: ['Gym', Validators.required],
      durationMin: [0, [Validators.required, Validators.min(1)]],
      workoutDate: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ],
      calories: [null],
      notes: [''],

      exercises: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.addExercise();
    this.checkIfUserHasWeeklyProgress();
  }

  get exercises(): FormArray {
    return this.workoutForm.get('exercises') as FormArray;
  }

  addExercise() {
    this.exercises.push(this.createExercsiseFrom());
  }

  removeExercise(index: number) {
    if (this.exercises.length > 1) {
      this.exercises.removeAt(index);
    }
  }

  createExercsiseFrom(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      weightInKgs: [0.5, [Validators.required, Validators.min(0.5)]],
      series: [1, [Validators.required, Validators.min(1)]],
      reps: [1, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit() {
    if (this.workoutForm.valid) this.isSubmitting = true;

    const workoutData: WeightliftingData = {
      type: this.workoutForm.value.type,
      durationMin: this.workoutForm.value.durationMin,
      workoutDate: new Date(this.workoutForm.value.workoutDate).toISOString(),
      calories: this.workoutForm.value.calories || null,
      notes: this.workoutForm.value.notes || null,
      weightliftingLog: {
        exercises: this.workoutForm.value.exercises,
      },
    };

    this.workoutService.AddWorkout(workoutData).subscribe({
      next: (_) => {
        this.toastr.success('Successfully logged workout.');
        const updatedWeeklyProgress: WeeklyProgress = {};
        if (this.weeklyProgress.workoutsDone === 0) {
          updatedWeeklyProgress.weeklyWorkoutStreak =
            this.weeklyProgress.weeklyWorkoutStreak! + 1;
        }

        updatedWeeklyProgress.workoutsDone =
          this.weeklyProgress.workoutsDone! + 1;
        this.incrementWeeklyWorkoutCount(this.userId, updatedWeeklyProgress);
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.toastr.error(err);
      },
    });

    this.isSubmitting = false;
  }

  resetForm() {
    this.workoutForm.reset();
    this.workoutForm.patchValue({
      type: 'Gym',
      workoutDate: new Date().toISOString().split('T')[0],
      calories: 0,
    });

    while (this.exercises.length > 0) {
      this.exercises.removeAt(0);
    }
    this.addExercise();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((arrControl) => {
          if (arrControl instanceof FormGroup) {
            this.markFormGroupTouched(arrControl);
          } else {
            arrControl?.markAsTouched();
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  getErrorMessage(fieldName: string, exerciseIndex?: number): string {
    let control;

    if (exerciseIndex !== undefined) {
      control = this.exercises.at(exerciseIndex).get(fieldName);
    } else {
      control = this.workoutForm.get(fieldName);
    }

    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName} is required`;
      }
      if (control.errors['min']) {
        return `${fieldName} must be greater than ${control.errors['min'].min}`;
      }
    }
    return '';
  }

  incrementWeeklyWorkoutCount(
    userId: number | null,
    progressData: WeeklyProgress
  ) {
    if (userId === null) return console.error('No userId found in token');

    if (!this.hasWeeklyProgress) {
      this.toastr.info(
        'Please set up your habits to track workouts done and other information.'
      );
      return;
    }

    this.progressService.patchWeeklyProgress(userId, progressData).subscribe({
      next: (_) => {
        console.log('Successfully patched workouts done.');
      },
      error: (err) => {
        this.toastr.error('Could not update workout count.');
        console.error(err);
      },
    });
  }

  getWeeklyProgress(userId: number | null) {
    if (userId === null)
      return console.error('Could not find userId in token.');

    this.progressService
      .getWeeklyProgressByUserId(userId)
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            console.log('No weekly progress found for user (404).');
            return of(null);
          }
          console.error('Error fetching weekly progress:', error);
          return of(null);
        })
      )
      .subscribe({
        next: (progress) => {
          if (progress) {
            this.weeklyProgress = progress;
          }
        },
      });
  }

  checkIfUserHasWeeklyProgress() {
    if (this.userId === null) return;

    this.progressService
      .getWeeklyProgressByUserId(this.userId)
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            console.log('No weekly progress found for user.');
            return of(null);
          }
          console.error('Error checking weekly progress.');
          return of(null);
        })
      )
      .subscribe({
        next: (progress) => {
          this.hasWeeklyProgress = !!progress;
          if (progress) {
            this.weeklyProgress = progress;
          }
        },
        error: (err) => {
          this.hasWeeklyProgress = false;
          console.error('Could not check weekly progress. ', err);
        },
      });
  }
}
