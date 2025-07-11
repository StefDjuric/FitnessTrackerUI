import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WorkoutService } from '../../services/workoutService';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RunData } from '../../../models/RunData';
import { Button } from '../button/button';

@Component({
  selector: 'app-log-run',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './log-run.html',
  styleUrl: './log-run.css',
})
export class LogRun {
  workoutService = inject(WorkoutService);
  workoutForm: FormGroup = new FormGroup({});
  isSubmitting: boolean = false;
  toastr = inject(ToastrService);
  router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.workoutForm = this.fb.group({
      type: ['Run', Validators.required],
      durationMin: [0, [Validators.required, Validators.min(1)]],
      workoutDate: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ],
      calories: [null],
      notes: [''],

      distanceInKms: [0, [Validators.required, Validators.min(0.1)]],
      shoe: [''],
    });
  }

  onSubmit() {
    if (this.workoutForm.valid) this.isSubmitting = true;

    const workoutData: RunData = {
      type: this.workoutForm.value.type,
      durationMin: this.workoutForm.value.durationMin,
      workoutDate: new Date(this.workoutForm.value.workoutDate).toISOString(),
      calories: this.workoutForm.value.calories || null,
      notes: this.workoutForm.value.notes || null,
      runLog: {
        distanceInKms: this.workoutForm.value.distanceInKms,
        shoe: this.workoutForm.value.shoe,
      },
    };

    this.workoutService.AddWorkout(workoutData).subscribe({
      next: (_) => {
        this.toastr.success('Successfully logged run.');
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
      type: 'Run',
      workoutDate: new Date().toISOString().split('T')[0],
      calories: 0,
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup) this.markFormGroupTouched(control);
      else control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string) {
    const control = this.workoutForm.get(fieldName);

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
}
