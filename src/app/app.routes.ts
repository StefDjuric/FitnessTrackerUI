import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Contact } from './components/contact/contact';
import { About } from './components/about/about';
import { NotFound } from './components/not-found/not-found';
import { ServerError } from './components/server-error/server-error';
import { Register } from './components/register/register';
import { authGuard } from './guards/auth-guard';
import { Dashboard } from './components/dashboard/dashboard';
import { WeightliftingLogForm } from './components/weightlifting-log-form/weightlifting-log-form';
import { LogRun } from './components/log-run/log-run';
import { SetHabitGoals } from './components/set-habit-goals/set-habit-goals';
import { WeightProgress } from './components/weight-progress/weight-progress';

export const routes: Routes = [
  // Private routes
  {
    path: '',
    component: Home,
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'log-workout', component: WeightliftingLogForm },
      { path: 'log-run', component: LogRun },
      { path: 'set-habits', component: SetHabitGoals },
      { path: 'log-weight', component: WeightProgress },
    ],
  },
  // Public routes
  { path: 'home', component: Home },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'signup',
    component: Register,
  },
  { path: 'contact', component: Contact },
  { path: 'about', component: About },
  { path: 'not-found', component: NotFound },
  { path: 'server-error', component: ServerError },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
