import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Button } from '../button/button';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [Button],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit, OnDestroy {
  @ViewChild('progressChart') progressChart!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  initializeChart() {
    // Progress Chart
    if (!this.progressChart?.nativeElement) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = this.progressChart.nativeElement.getContext('2d');

    if (ctx === null) {
      console.error('Ctx is null');
      return;
    }

    if (this.chart) this.chart.destroy();

    this.progressChart.nativeElement.width = 400;
    this.progressChart.nativeElement.height = 300;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Workouts',
            data: [1, 2, 1, 3, 2, 1, 2],
            borderColor: '#dda15e',
            backgroundColor: 'rgba(221, 161, 94, 0.1)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Runs',
            data: [0, 1, 1, 0, 1, 2, 1],
            borderColor: '#606c38',
            backgroundColor: 'rgba(96, 108, 56, 0.1)',
            tension: 0.4,
            fill: true,
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

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
