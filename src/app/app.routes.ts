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
    children: [{ path: 'dashboard', component: Dashboard }],
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
