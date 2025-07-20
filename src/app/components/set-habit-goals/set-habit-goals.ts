import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Goals } from '../../../models/Goals';
import { Button } from '../button/button';
import { GoalService } from '../../services/goal-service';
import { Router } from '@angular/router';
import { ProgressService } from '../../services/progress-service';
import { WeeklyProgress } from '../../../models/WeeklyProgress';
import { Account } from '../../services/account';

@Component({
  selector: 'app-set-habit-goals',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './set-habit-goals.html',
  styleUrl: './set-habit-goals.css',
})
export class SetHabitGoals implements OnInit {
  habitsForm: FormGroup = new FormGroup({});
  isSubmitting: boolean = false;
  private toastr = inject(ToastrService);
  private router: Router = inject(Router);
  private goalService = inject(GoalService);
  private progressService = inject(ProgressService);
  private accountService = inject(Account);
  private userId = this.accountService.getUserIdFromToken();
  weeklyProgress!: WeeklyProgress;

  constructor(private fb: FormBuilder) {
    this.habitsForm = this.fb.group({
      workoutsGoalInWeek: [3, [Validators.required, Validators.min(1)]],
      waterGoalInLiters: [3, [Validators.required, Validators.min(1)]],
      weightGoal: [0, [Validators.required, Validators.min(1)]],
      mealsEatenGoal: [3, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.getWeeklyProgress(this.userId);
  }

  onSubmit() {
    if (this.habitsForm.valid) this.isSubmitting = true;

    const habitsData: Goals = {
      workoutsGoalInWeek: this.habitsForm.value.workoutsGoalInWeek,
      waterGoalInLiters: this.habitsForm.value.waterGoalInLiters,
      weightGoal: this.habitsForm.value.weightGoal,
      mealsEatenGoal: this.habitsForm.value.mealsEatenGoal,
    };

    this.setGoals(habitsData);

    this.isSubmitting = false;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  getErrorMessage(fieldName: string) {
    let control = this.habitsForm.get(fieldName);

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

  setGoals(data: Goals) {
    this.goalService.SetGoals(data).subscribe({
      next: (_) => {
        this.toastr.success('Successfully set new habits.');
        if (this.weeklyProgress === null || this.weeklyProgress === undefined)
          this.initWeeklyProgress();
      },
      error: (err) => {
        this.toastr.error('Could not set new habits.');
        console.error(err);
      },
    });
  }

  initWeeklyProgress() {
    this.progressService.initWeeklyProgress().subscribe({
      next: (_) => {
        console.log('Successfully initialized weekly progress.');
        this.router.navigateByUrl('dashboard');
      },
      error: (err) => {
        this.toastr.error('Could not initialize weekly progress.');
        console.error(err);
      },
    });
  }

  getWeeklyProgress(userId: number | null) {
    if (userId === null) return console.error('No userId found in token.');
    this.progressService.getWeeklyProgressByUserId(userId).subscribe({
      next: (progress) => {
        this.weeklyProgress = progress;
      },
      error: (err) => {
        console.error('Could not get weekly progress for user.');
      },
    });
  }
}
