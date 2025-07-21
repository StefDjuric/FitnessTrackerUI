import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WeightEntry } from '../../../models/WeightEntry';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-weight-progress',
  imports: [ReactiveFormsModule],
  templateUrl: './weight-progress.html',
  styleUrl: './weight-progress.css',
})
export class WeightProgress implements AfterViewInit {
  @ViewChild('progressChart') progressChart!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  weightForm: FormGroup = new FormGroup({});
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder) {
    this.weightForm = this.fb.group({
      weight: [0, [Validators.required, Validators.min(1)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  onSubmit() {
    if (this.weightForm.valid) this.isSubmitting = true;

    const weightData: WeightEntry = {
      date: this.weightForm.value.date,
      weight: this.weightForm.value.weight,
    };

    // TODO: Add weight entry

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
    const control = this.weightForm.get(fieldName);

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

  initChart() {
    if (!this.progressChart?.nativeElement) {
      console.error('Canvas element not found.');
      return;
    }

    const ctx = this.progressChart.nativeElement.getContext('2d');

    if (ctx === null) {
      console.error('Context is null');
      return;
    }

    if (this.chart) this.chart.destroy();

    this.progressChart.nativeElement.width = 400;
    this.progressChart.nativeElement.height = 300;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [1, 2, 3],
        datasets: [
          {
            label: 'Weight (kg)',
            data: [80, 81, 85, 72],
            borderColor: '#dda15e',
            backgroundColor: 'rgba(214, 39, 40, 0.1)',
            tension: 0.4,
            fill: false,
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }
}
