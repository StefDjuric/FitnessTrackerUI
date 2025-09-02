import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProfileForm } from '../../../models/Profile-form';
import { User } from '../../../models/User';
import { Account } from '../../services/account';
import { FormsModule } from '@angular/forms';
import { Button } from '../button/button';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-profile',
  imports: [RouterLink, FormsModule, Button],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile implements OnInit {
  private accountService: Account = inject(Account);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  currentUserEmail = this.accountService.getEmailFromToken();
  currentUserUsername = this.accountService.currentUser()?.userName;

  profileForm: ProfileForm = {
    confirmPassword: '',
    currentPassword: '',
    email: this.currentUserEmail,
    newPassword: '',
    username: this.currentUserUsername,
  };
  currentUser: User | null = null;
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  errorMessage: string = '';

  isLoading: boolean = false;

  ngOnInit(): void {
    this.loadUserData();
  }
  loadUserData() {
    this.currentUser = this.accountService.currentUser();

    if (this.currentUser) {
      this.profileForm.username = this.currentUser.userName;
    }
  }

  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getUserInitials(): string {
    if (!this.currentUser?.userName) {
      return 'U';
    }

    const names = this.currentUser.userName.split('_').join(' ').split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return this.currentUser.userName.substring(0, 2).toUpperCase();
  }

  onDeleteAccount() {}

  onSaveChanges() {
    this.accountService.editProfile(this.profileForm).subscribe({
      next: (_) => {
        this.toastr.success('Successfully updated profile.');
        this.accountService.currentUser()!.userName = this.profileForm.username
          ? this.profileForm.username
          : '';
        this.accountService.currentUser()!.email = this.profileForm.email
          ? this.profileForm.email
          : this.accountService.currentUser()?.email;
        this.currentUserEmail = this.profileForm.email;
        this.currentUserUsername = this.profileForm.username;
        this.accountService.logout();
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        this.toastr.error('Could not update profile');
        console.error(err);
      },
    });
  }
}
