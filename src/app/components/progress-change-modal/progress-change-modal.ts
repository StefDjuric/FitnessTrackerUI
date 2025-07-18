import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ProgressService } from '../../services/progress-service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WeeklyProgress } from '../../../models/WeeklyProgress';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-progress-change-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './progress-change-modal.html',
  styleUrl: './progress-change-modal.css',
})
export class ProgressChangeModal implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() userId: number | null = null;
  @Input() currentWeeklyProgress: WeeklyProgress | null = null;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() updateWeeklyProgressEvent = new EventEmitter<WeeklyProgress>();
  progressService = inject(ProgressService);
  progressForm: FormGroup = new FormGroup({});
  private toastr = inject(ToastrService);
  isSubmitting: boolean = false;

  constructor(private pb: FormBuilder) {
    this.progressForm = this.pb.group({
      waterConsumed: [0, Validators.min(0)],
      mealsEaten: [0, Validators.min(0)],
    });
  }

  ngOnChanges(): void {
    if (this.currentWeeklyProgress) {
      this.progressForm.patchValue({
        waterConsumed: this.currentWeeklyProgress.waterConsumed || 0,
        mealsEaten: this.currentWeeklyProgress.mealsEaten || 0,
      });
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  closeModal() {
    this.closeModalEvent.emit();
  }

  onSubmit() {
    if (this.progressForm.valid) this.isSubmitting = true;

    const progressData: WeeklyProgress = {
      mealsEaten: this.progressForm.value.mealsEaten,
      waterConsumed: this.progressForm.value.waterConsumed,
    };

    this.patchWeeklyProgress(this.userId, progressData);

    this.isSubmitting = false;
  }

  patchWeeklyProgress(userId: number | null, model: WeeklyProgress) {
    if (userId == null) return console.error('No userId found in token');

    this.progressService.patchWeeklyProgress(userId, model).subscribe({
      next: (_) => {
        this.toastr.success('Successfully updated weekly progress.');
        this.updateWeeklyProgressEvent.emit(model);
      },
      error: (err) => {
        this.toastr.error('Could not update weekly progress');
        console.error(err);
      },
    });
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
    let control = this.progressForm.get(fieldName);

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
