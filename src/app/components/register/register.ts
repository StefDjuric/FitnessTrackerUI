import { Component, inject, OnInit } from '@angular/core';
import { Account } from '../../services/account';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { Button } from '../button/button';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgClass, Button, RouterLink],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  accountService = inject(Account);
  router = inject(Router);
  toastr = inject(ToastrService);
  registerForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        this.matchValues('password'),
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      fullName: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => {
        this.registerForm.controls['confirmPassword'].updateValueAndValidity();
      },
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
        ? null
        : { isMatching: true };
    };
  }

  register() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: (_) => {
        this.router.navigateByUrl('/dashboard');
        this.toastr.success('Successfully registered.');
      },
      error: (err) => (this.validationErrors = this.extractErrorMessages(err)),
    });
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
