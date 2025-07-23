import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WeightEntry } from '../../../models/WeightEntry';
import { Chart, registerables } from 'chart.js';
import { WeightEntryService } from '../../services/weight-entry-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

Chart.register(...registerables);

@Component({
  selector: 'app-weight-progress',
  imports: [ReactiveFormsModule],
  templateUrl: './weight-progress.html',
  styleUrl: './weight-progress.css',
})
export class WeightProgress implements OnInit {
  @ViewChild('progressChart') progressChart!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  weightForm: FormGroup = new FormGroup({});
  isSubmitting: boolean = false;
  private weightEntryService = inject(WeightEntryService);
  private toastrService = inject(ToastrService);
  private router = inject(Router);
  weightEntries: WeightEntry[] = [];
  inPastDaysLimit = 30;
  private chartWeightData: number[] = [];
  private chartDateData: Date[] = [];

  constructor(private fb: FormBuilder) {
    this.weightForm = this.fb.group({
      weight: [0, [Validators.required, Validators.min(1)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
    });
  }

  ngOnInit(): void {
    this.getWeightEntriesForUser(this.inPastDaysLimit);
  }

  onSubmit() {
    if (this.weightForm.valid) this.isSubmitting = true;

    const weightData: WeightEntry = {
      date: this.weightForm.value.date,
      weight: this.weightForm.value.weight,
    };

    this.addWeightEntry(weightData);

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

    this.prepareChartData();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartDateData,
        datasets: [
          {
            label: 'Weight (kg)',
            data: this.chartWeightData,
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

  prepareChartData() {
    this.chartWeightData = this.weightEntries.flatMap((entry) => entry.weight);
    this.chartDateData = this.weightEntries.flatMap((entry) => entry.date);
  }

  addWeightEntry(model: WeightEntry) {
    this.weightEntryService.addWeightEntry(model).subscribe({
      next: (_) => {
        this.toastrService.success('Successfully added weight entry.');
        this.getWeightEntriesForUser(this.inPastDaysLimit);
      },
      error: (err) => {
        this.toastrService.error('Could not add weight entry.');
        console.error(err);
      },
    });
  }

  getWeightEntriesForUser(inPastDaysLimit: number) {
    this.weightEntryService.getWeightEntriesForUser(inPastDaysLimit).subscribe({
      next: (weightEntries) => {
        this.weightEntries = weightEntries;
        this.initChart();
      },
      error: (err) => {
        this.toastrService.error('Could not fetch weight entries.');
        console.error(err);
      },
    });
  }

  setInPastDaysLimit(inPastDaysLimit: number) {
    this.inPastDaysLimit = inPastDaysLimit;
    this.getWeightEntriesForUser(this.inPastDaysLimit);
  }
}
