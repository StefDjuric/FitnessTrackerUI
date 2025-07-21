import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Button } from '../button/button';
import { Chart, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';
import { Account } from '../../services/account';
import { WorkoutService } from '../../services/workoutService';
import { Workout } from '../../../models/Workout';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Goals } from '../../../models/Goals';
import { GoalService } from '../../services/goal-service';
import { ProgressService } from '../../services/progress-service';
import { WeeklyProgress } from '../../../models/WeeklyProgress';
import { ProgressChangeModal } from '../progress-change-modal/progress-change-modal';
import { User } from '../../../models/User';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [Button, RouterLink, DatePipe, ProgressChangeModal],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnDestroy, OnInit {
  @ViewChild('progressChart') progressChart!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  private chartRunningDates: Array<string> = [];
  private chartLiftingDates: Array<string> = [];
  private chartRunningValues: Array<number> = [];
  private chartLiftingValues: Array<number> = [];
  private toastrService = inject(ToastrService);
  goalService = inject(GoalService);
  accountService = inject(Account);
  workoutService = inject(WorkoutService);
  progressService = inject(ProgressService);
  userId = this.accountService.getUserIdFromToken();
  currentUser?: User;
  userWorkouts: Workout[] = [];
  workoutLimit = 3;
  workoutCount: number = 0;
  runCount: number = 0;
  liftingCount: number = 0;
  currentUserGoals: Goals = {
    mealsEatenGoal: 3,
    waterGoalInLiters: 3,
    workoutsGoalInWeek: 3,
    weightGoal: 80,
  };
  weeklyProgress: WeeklyProgress = {
    mealsEaten: 0,
    waterConsumed: 0,
    workoutsDone: 0,
    weekStartDate: new Date(Date.now()),
  };
  isModalOpen: boolean = false;

  ngOnInit(): void {
    this.getUserWorkouts(this.userId, this.workoutLimit);
    this.getWorkoutCount(this.userId);
    this.getRunCount(this.userId);
    this.getLiftingCount(this.userId);
    this.getUserGoals(this.userId);
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

    this.prepareChartData();

    const last7Days = this.getLast7Days();

    const runningData = last7Days.map((date) => {
      const idx = this.chartRunningDates.indexOf(date);
      return idx !== -1 ? this.chartRunningValues[idx] : 0;
    });

    const liftingData = last7Days.map((date) => {
      const idx = this.chartLiftingDates.indexOf(date);
      return idx !== -1 ? this.chartLiftingValues[idx] : 0;
    });

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: last7Days,
        datasets: [
          {
            label: 'Runs',
            data: runningData,
            borderColor: '#606c38',
            backgroundColor: 'rgba(96, 108, 56, 0.1)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Gym',
            data: liftingData,
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
            ticks: {
              stepSize: 1,
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

  private getLast7Days() {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const formatedDate = date.toISOString().split('T')[0];
      dates.push(formatedDate);
    }

    return dates;
  }

  prepareChartData() {
    this.chartRunningDates = [];
    this.chartLiftingDates = [];
    this.chartRunningValues = [];
    this.chartLiftingValues = [];

    const workoutsDone: Array<{
      workoutDate: string;
      workoutsCounted: number;
      type: string;
    }> = [];

    this.userWorkouts.forEach((workout) => {
      const date = workout.workoutDate.split('T')[0];
      if (workoutsDone.find((w) => w.workoutDate === date)) {
        const idx = workoutsDone.findIndex((w) => w.workoutDate === date);
        workoutsDone[idx].workoutsCounted++;
      } else {
        if (workout.weightliftingLog)
          workoutsDone.push({
            workoutDate: date,
            workoutsCounted: 1,
            type: 'Gym',
          });
        else if (workout.runLog)
          workoutsDone.push({
            workoutDate: date,
            workoutsCounted: 1,
            type: 'Run',
          });
      }
    });

    this.chartRunningDates = workoutsDone
      .filter((workout) => workout.type === 'Run')
      .map((workout) => workout.workoutDate);

    this.chartLiftingDates = workoutsDone
      .filter((workout) => workout.type === 'Gym')
      .map((workout) => workout.workoutDate);

    this.chartRunningValues = workoutsDone
      .filter((workout) => workout.type === 'Run')
      .map((workout) => workout.workoutsCounted);

    this.chartLiftingValues = workoutsDone
      .filter((workout) => workout.type === 'Gym')
      .map((workout) => workout.workoutsCounted);
  }

  getUserWorkouts(userId: number | null, limit?: number) {
    if (userId == null) return console.error('User id is null.');

    this.workoutService.getAllWorkoutsForUser(userId, limit).subscribe({
      next: (workouts) => {
        this.userWorkouts = workouts;
        console.log(this.userWorkouts);

        this.initializeChart();

        this.checkAndResetWeeklyProgressIfInactive();
      },
      error: (err) => {
        this.toastrService.error('Could not fetch user workouts. ', err);
        console.log(err);
      },
    });
  }

  getWorkoutCount(userId: number | null) {
    if (userId == null) return console.error('User id is null.');

    this.workoutService.getWorkoutCountForUser(userId).subscribe({
      next: (count) => {
        this.workoutCount = count;
      },
      error: (err) => {
        this.toastrService.error('Could not fetch workout count. ', err);
        console.error(err);
      },
    });
  }

  getRunCount(userId: number | null) {
    if (userId == null) return console.error('No userId found in token.');

    this.workoutService.getRunCountForUser(userId).subscribe({
      next: (count) => {
        this.runCount = count;
      },
      error: (err) => {
        this.toastrService.error('Could not fetch run count. ', err);
        console.error(err);
      },
    });
  }

  getLiftingCount(userId: number | null) {
    if (userId == null) return console.error('No userId found in token.');

    this.workoutService.getWeightliftingCountForUser(userId).subscribe({
      next: (count) => {
        this.liftingCount = count;
      },
      error: (err) => {
        this.toastrService.error('Could not fetch lifting count. ', err);
        console.error(err);
      },
    });
  }

  getUserGoals(userId: number | null) {
    if (userId === null)
      return console.error('Could not find the userId in token.');

    this.goalService.GetCurrentGoalsForUser(userId).subscribe({
      next: (goals) => {
        if (goals) {
          this.currentUserGoals = goals;
          this.getWeeklyProgressForUser(this.userId);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getWeeklyProgressForUser(userId: number | null) {
    if (userId === null) return console.error('No user id found in token.');

    this.progressService.getWeeklyProgressByUserId(userId).subscribe({
      next: (progress) => {
        if (progress) {
          this.weeklyProgress = progress;
          console.log('Successfully fetched weekly progress.');

          this.checkAndResetDailyProgress();
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onProgressUpdated(updatedProgress: WeeklyProgress) {
    this.weeklyProgress = {
      ...this.weeklyProgress,
      mealsEaten: updatedProgress.mealsEaten,
      waterConsumed: updatedProgress.waterConsumed,
    };

    this.closeModal();
  }

  private checkAndResetDailyProgress() {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('lastProgressResetDate');

    if (storedDate !== today) {
      if (new Date().getDay() === 1) {
        this.weeklyProgress = {
          ...this.weeklyProgress,
          workoutsDone: 0,
          waterConsumed: 0,
          mealsEaten: 0,
          weekStartDate: new Date(),
        };
      } else {
        this.weeklyProgress = {
          ...this.weeklyProgress,
          waterConsumed: 0,
          mealsEaten: 0,
        };
      }

      localStorage.setItem('lastProgressResetDate', today);

      this.resetDailyProgressOnServer(this.userId);
    }
  }

  private resetDailyProgressOnServer(userId: number | null) {
    if (userId === null) return console.error('No userId found in token.');
    this.progressService
      .patchWeeklyProgress(userId, this.weeklyProgress)
      .subscribe({
        next: (_) => {
          console.log('Successfully reset daily progress on server.');
        },
        error: (err) => {
          console.error('Could not reset daily progress on server. ', err);
        },
      });
  }

  private checkAndResetWeeklyProgressIfInactive() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const hasRecentWorkouts = this.userWorkouts.some((workout) => {
      const workoutDate = new Date(workout.workoutDate);
      return workoutDate >= sevenDaysAgo;
    });

    if (!hasRecentWorkouts && this.weeklyProgress.workoutsDone! > 0) {
      this.resetWeeklyProgress();
    }
  }

  private resetWeeklyProgress() {
    this.weeklyProgress = {
      ...this.weeklyProgress,
      workoutsDone: 0,
      waterConsumed: 0,
      mealsEaten: 0,
      weekStartDate: new Date(),
    };

    this.resetWeeklyProgressOnServer(this.userId);

    this.toastrService.info(
      'Weekly progress reset due to no workouts in the past 7 days.'
    );
  }

  resetWeeklyProgressOnServer(userId: number | null) {
    if (userId === null) return console.error('No userId found in token.');

    this.progressService
      .patchWeeklyProgress(userId, this.weeklyProgress)
      .subscribe({
        next: (_) => {
          console.log('Successfully reset weekly progress on server.');
        },
        error: (err) => {
          console.error('Could not reset weekly progress on server. ', err);
          this.toastrService.error(
            'Failed to reset weekly progress on server.'
          );
        },
      });
  }
}
