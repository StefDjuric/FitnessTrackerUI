import { Component, inject, OnInit } from '@angular/core';
import { Account } from '../../services/account';
import { ToastrService } from 'ngx-toastr';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Button } from '../button/button';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgClass, Button, RouterLink],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private accountService = inject(Account);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  loginForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = new FormGroup({
      emailOrUsername: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    this.accountService.login(this.loginForm.value).subscribe({
      next: (_) => {
        this.router.navigateByUrl('/dashboard');
        this.toastr.success('Successfully logged in.');
      },
      error: (err) => {
        this.validationErrors = this.extractErrorMessages(err);
      },
    });
  }

  logout() {
    this.accountService.logout();
  }

  private extractErrorMessages(error: any): string[] {
    if (Array.isArray(error)) {
      return error;
    }

    if (error?.error) {
      if (typeof error.error === 'string') {
        return [error.error];
      }

      if (error.error.errors) {
        return Object.values(error.error.errors).flat() as string[];
      }

      if (error.error.message) {
        return [error.error.message];
      }
    }

    if (error?.message) {
      return [error.message];
    }

    if (error?.statusText) {
      return [error.statusText];
    }

    return [error?.toString() || 'An unknown error occurred'];
  }
}
