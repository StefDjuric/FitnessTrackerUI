import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WorkoutData } from '../../../models/WorkoutData';
import { Button } from '../button/button';

@Component({
  selector: 'app-weightlifting-log-form',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './weightlifting-log-form.html',
  styleUrl: './weightlifting-log-form.css',
})
export class WeightliftingLogForm implements OnInit {
  workoutForm: FormGroup = new FormGroup({});
  isSubmitting: boolean = false;

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
      exerciseName: ['', Validators.required],
      weightInKg: [0.5, [Validators.required, Validators.min(0.5)]],
      series: [1, [Validators.required, Validators.min(1)]],
      reps: [1, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit() {
    if (this.workoutForm.valid) this.isSubmitting = true;

    const workoutData: WorkoutData = {
      type: this.workoutForm.value.type,
      durationMin: this.workoutForm.value.durationMin,
      workoutDate: new Date(this.workoutForm.value.workoutDate),
      calories: this.workoutForm.value.calories || null,
      notes: this.workoutForm.value.notes || null,
      exercises: this.workoutForm.value.exercises,
    };
    console.log('Workout data: ', workoutData);
    console.log('Exercises: ', this.exercises);
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
}
