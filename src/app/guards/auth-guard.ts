import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Account } from '../services/account';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(Account);
  const toastr = inject(ToastrService);

  if (accountService.currentUser()) return true;
  else {
    toastr.error('You must login before visiting this route.');
    return false;
  }
};
